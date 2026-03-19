import cors from 'cors'
import express from 'express'
import nodemailer from 'nodemailer'

const REQUIRED_ENV_VARS = ['EMAIL_USER', 'EMAIL_PASS']
const missingEnvVars = REQUIRED_ENV_VARS.filter((envVar) => !process.env[envVar]?.trim())

if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`)
  process.exit(1)
}

const PORT = Number.parseInt(process.env.PORT ?? '3001', 10)
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 5
const MAX_NAME_LENGTH = 120
const MAX_EMAIL_LENGTH = 254
const MAX_MESSAGE_LENGTH = 5000
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const requestLog = new Map()

const app = express()
const allowedOrigin = process.env.ALLOWED_ORIGIN?.trim()

app.disable('x-powered-by')
app.set('trust proxy', 1)
app.use(
  cors(
    allowedOrigin
      ? {
          origin: allowedOrigin,
        }
      : undefined,
  ),
)
app.use(express.json({ limit: '10kb' }))

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

function sanitizeInput(value, maxLength) {
  return String(value ?? '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength)
}

function getClientIp(req) {
  const forwardedFor = req.headers['x-forwarded-for']

  if (typeof forwardedFor === 'string' && forwardedFor.length > 0) {
    return forwardedFor.split(',')[0].trim()
  }

  return req.ip || req.socket.remoteAddress || 'unknown'
}

function applyRateLimit(req, res, next) {
  const now = Date.now()
  const clientIp = getClientIp(req)
  const recentRequests = (requestLog.get(clientIp) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  )

  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests. Please try again later.',
    })
  }

  recentRequests.push(now)
  requestLog.set(clientIp, recentRequests)

  for (const [ip, timestamps] of requestLog.entries()) {
    const validTimestamps = timestamps.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS)

    if (validTimestamps.length === 0) {
      requestLog.delete(ip)
      continue
    }

    requestLog.set(ip, validTimestamps)
  }

  return next()
}

function validateContactPayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return {
      isValid: false,
      errors: ['Request body must be a JSON object.'],
      sanitizedData: null,
    }
  }

  const sanitizedData = {
    name: sanitizeInput(payload.name, MAX_NAME_LENGTH),
    email: sanitizeInput(payload.email, MAX_EMAIL_LENGTH).toLowerCase(),
    message: sanitizeInput(payload.message, MAX_MESSAGE_LENGTH),
  }

  const errors = []

  if (sanitizedData.name.length < 2) {
    errors.push('Name must be at least 2 characters long.')
  }

  if (!EMAIL_REGEX.test(sanitizedData.email)) {
    errors.push('Email address is invalid.')
  }

  if (sanitizedData.message.length < 10) {
    errors.push('Message must be at least 10 characters long.')
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData,
  }
}

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK' })
})

app.post('/send', applyRateLimit, async (req, res) => {
  const { isValid, errors, sanitizedData } = validateContactPayload(req.body)

  if (!isValid || !sanitizedData) {
    return res.status(400).json({
      success: false,
      error: 'Invalid request payload.',
      details: errors,
    })
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      replyTo: sanitizedData.email,
      to: process.env.EMAIL_USER,
      subject: `New message from ${sanitizedData.name}`,
      text: [
        `Name: ${sanitizedData.name}`,
        `Email: ${sanitizedData.email}`,
        '',
        sanitizedData.message,
      ].join('\n'),
    })

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Failed to send email.', error)

    return res.status(502).json({
      success: false,
      error: 'Unable to process the request right now.',
    })
  }
})

async function startServer() {
  try {
    await transporter.verify()
    app.listen(PORT, () => {
      console.log(`Mail server running on ${PORT}`)
    })
  } catch (error) {
    console.error('Mail transporter verification failed.', error)
    process.exit(1)
  }
}

startServer()
