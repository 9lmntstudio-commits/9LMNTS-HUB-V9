import { serve } from 'https://deno.land/std@0.178.0/http/server.ts';
// Edge Function: ai-empire-lead-submission
// Receives lead JSON, saves to Supabase via REST, forwards to AI_EMPIRE_URL, sends Slack, Notion, and email via SMTP.

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const AI_EMPIRE_URL = Deno.env.get('AI_EMPIRE_URL') || 'http://localhost:8000/api/submit-lead';
const SLACK_WEBHOOK_URL = Deno.env.get('SLACK_WEBHOOK_URL');
const SLACK_CHANNEL = Deno.env.get('SLACK_CHANNEL');
const NOTION_TOKEN = Deno.env.get('NOTION_TOKEN');
const NOTION_DATABASE_ID = Deno.env.get('NOTION_DATABASE_ID');
const SMTP_HOST = Deno.env.get('SMTP_HOST');
const SMTP_PORT = Deno.env.get('SMTP_PORT');
const SMTP_USERNAME = Deno.env.get('SMTP_USERNAME');
const SMTP_PASSWORD = Deno.env.get('SMTP_PASSWORD');
const EMAIL_FROM = Deno.env.get('EMAIL_FROM');
const EMAIL_TO = Deno.env.get('EMAIL_TO');

console.log('Function ai-empire-lead-submission starting');

async function forwardToAIEmpire(lead) {
    try {
        const res = await fetch(AI_EMPIRE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lead),
        });
        const data = await res.text();
        return { ok: res.ok, status: res.status, data };
    } catch (err) {
        return { ok: false, error: String(err) };
    }
}

async function saveToSupabase(lead) {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return { ok: false, error: 'Supabase env missing' };
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                Prefer: 'return=representation',
            },
            body: JSON.stringify(lead),
        });
        const data = await res.json();
        return { ok: res.ok, status: res.status, data };
    } catch (err) {
        return { ok: false, error: String(err) };
    }
}

async function sendSlack(lead) {
    if (!SLACK_WEBHOOK_URL) return { ok: false, error: 'Slack webhook missing' };
    const payload = {
        channel: SLACK_CHANNEL || undefined,
        text: `New lead: *${lead.name}*\n${lead.company || ''} - ${lead.email}`,
    };
    try {
        const res = await fetch(SLACK_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const text = await res.text();
        return { ok: res.ok, status: res.status, text };
    } catch (err) {
        return { ok: false, error: String(err) };
    }
}

async function createNotionPage(lead) {
    if (!NOTION_TOKEN || !NOTION_DATABASE_ID) return { ok: false, error: 'Notion env missing' };
    const page = {
        parent: { database_id: NOTION_DATABASE_ID },
        properties: {
            Name: { title: [{ text: { content: lead.name || 'Unnamed' } }] },
            Email: { rich_text: [{ text: { content: lead.email || '' } }] },
            Company: { rich_text: [{ text: { content: lead.company || '' } }] },
        },
    };
    try {
        const res = await fetch('https://api.notion.com/v1/pages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NOTION_TOKEN}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(page),
        });
        const data = await res.json();
        return { ok: res.ok, status: res.status, data };
    } catch (err) {
        return { ok: false, error: String(err) };
    }
}

async function sendEmail(lead) {
    if (!SMTP_HOST || !SMTP_USERNAME || !SMTP_PASSWORD) return { ok: false, error: 'SMTP env missing' };
    try {
        return { ok: false, error: 'Direct SMTP not implemented in this Edge Function. Use SendGrid or Mailgun and set EMAIL_PROVIDER env, or handle email via Supabase SMTP integration.' };
    } catch (err) {
        return { ok: false, error: String(err) };
    }
}

function parseJSON(req) {
    return req.json().catch(() => ({}));
}

serve(async (req) => {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed, POST only' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
    }
    const lead = await parseJSON(req);
    // Basic validation
    if (!lead.email || !lead.name) {
        return new Response(JSON.stringify({ error: 'Missing name or email' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const results = {};
    // Forward to AI Empire but don't fail the request if unreachable
    results.forward = await forwardToAIEmpire(lead);

    // Save to Supabase
    results.saved = await saveToSupabase(lead);

    // Integrations in parallel
    const [slackRes, notionRes, emailRes] = await Promise.all([
        sendSlack(lead),
        createNotionPage(lead),
        sendEmail(lead),
    ]);
    results.integrations = { slack: slackRes, notion: notionRes, email: emailRes };

    return new Response(JSON.stringify(results), { status: 200, headers: { 'Content-Type': 'application/json' } });
});
