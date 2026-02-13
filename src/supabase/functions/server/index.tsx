import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2";

const app = new Hono();

// Create Supabase client for admin operations
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Create Supabase client for user token verification
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-662c70dc/health", (c) => {
  return c.json({ status: "ok" });
});

// Sign up endpoint
app.post("/make-server-662c70dc/auth/signup", async (c) => {
  try {
    const { email, password, name, role = 'user' } = await c.req.json();

    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    // Create user with admin client
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        name,
        role // Store role in user metadata (user or admin)
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata.name,
        role: data.user.user_metadata.role
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

// Verify user endpoint (for checking if user is admin)
app.get("/make-server-662c70dc/auth/verify", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    console.log('Auth header received:', authHeader ? 'Present' : 'Missing');

    if (!authHeader) {
      console.error('Verification error: No Authorization header');
      return c.json({ error: 'No access token provided' }, 401);
    }

    const accessToken = authHeader.split(' ')[1];

    if (!accessToken) {
      console.error('Verification error: No access token in header');
      return c.json({ error: 'No access token provided' }, 401);
    }

    console.log('Attempting to verify token with admin client...');

    // Use admin client to verify the JWT token
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error) {
      console.error('Verification error from Supabase:', error);
      return c.json({ error: 'Invalid token', details: error.message }, 401);
    }

    if (!user) {
      console.error('Verification error: No user returned');
      return c.json({ error: 'Invalid token' }, 401);
    }

    console.log('User verified successfully:', user.email, 'Role:', user.user_metadata?.role);

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name,
        role: user.user_metadata?.role || 'user'
      }
    });
  } catch (error) {
    console.error('Verification exception:', error);
    return c.json({ error: 'Failed to verify user', details: error.message }, 500);
  }
});

// Admin-only endpoint to get all users
app.get("/make-server-662c70dc/admin/users", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    console.log('Admin users request - Auth header:', authHeader ? 'Present' : 'Missing');

    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const accessToken = authHeader.split(' ')[1];

    if (!accessToken) {
      console.error('No access token found in header');
      return c.json({ error: 'Unauthorized' }, 401);
    }

    console.log('Verifying admin user token...');

    // Use admin client to verify the JWT token
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error) {
      console.error('Token verification error:', error);
      return c.json({ error: 'Unauthorized - Invalid token' }, 403);
    }

    if (!user) {
      console.error('No user found from token');
      return c.json({ error: 'Unauthorized - Invalid token' }, 403);
    }

    console.log('User verified:', user.email, 'Role:', user.user_metadata?.role);

    if (user.user_metadata?.role !== 'admin') {
      console.error('User is not an admin');
      return c.json({ error: 'Unauthorized - Admin access required' }, 403);
    }

    console.log('Fetching all users...');

    // Get all users (admin only)
    const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return c.json({ error: 'Failed to fetch users' }, 500);
    }

    console.log(`Successfully fetched ${users.length} users`);

    return c.json({
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        name: u.user_metadata?.name,
        role: u.user_metadata?.role || 'user',
        created_at: u.created_at
      }))
    });
  } catch (error) {
    console.error('Error in admin users endpoint:', error);
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

// CRM Endpoints - Get all clients
app.get("/make-server-662c70dc/clients", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');

    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const accessToken = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    console.log('Fetching all clients...');
    const clients = await kv.getByPrefix('client:');

    return c.json({ clients: clients || [] });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return c.json({ error: 'Failed to fetch clients' }, 500);
  }
});

// CRM Endpoints - Create client
app.post("/make-server-662c70dc/clients", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');

    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const accessToken = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const clientData = await c.req.json();

    if (!clientData.name || !clientData.email) {
      return c.json({ error: 'Name and email are required' }, 400);
    }

    const clientId = clientData.id || `client_${Date.now()}`;
    const client = {
      ...clientData,
      id: clientId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user.id
    };

    await kv.set(`client:${clientId}`, client);

    console.log(`Client created: ${clientId}`);
    return c.json({ success: true, client });
  } catch (error) {
    console.error('Error creating client:', error);
    return c.json({ error: 'Failed to create client' }, 500);
  }
});

// CRM Endpoints - Update client
app.put("/make-server-662c70dc/clients/:id", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');

    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const accessToken = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const clientId = c.req.param('id');
    const updates = await c.req.json();

    const existingClient = await kv.get(`client:${clientId}`);

    if (!existingClient) {
      return c.json({ error: 'Client not found' }, 404);
    }

    const updatedClient = {
      ...existingClient,
      ...updates,
      id: clientId,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`client:${clientId}`, updatedClient);

    console.log(`Client updated: ${clientId}`);
    return c.json({ success: true, client: updatedClient });
  } catch (error) {
    console.error('Error updating client:', error);
    return c.json({ error: 'Failed to update client' }, 500);
  }
});

// CRM Endpoints - Delete client
app.delete("/make-server-662c70dc/clients/:id", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');

    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const accessToken = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const clientId = c.req.param('id');

    await kv.del(`client:${clientId}`);

    console.log(`Client deleted: ${clientId}`);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting client:', error);
    return c.json({ error: 'Failed to delete client' }, 500);
  }
});

// Project Endpoints - Get all projects
app.get("/make-server-662c70dc/projects", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');

    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const accessToken = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    console.log('Fetching all projects...');
    const projects = await kv.getByPrefix('project:');

    return c.json({ projects: projects || [] });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return c.json({ error: 'Failed to fetch projects' }, 500);
  }
});

// Project Endpoints - Create project
app.post("/make-server-662c70dc/projects", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');

    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const accessToken = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const projectData = await c.req.json();

    if (!projectData.name || !projectData.type) {
      return c.json({ error: 'Name and type are required' }, 400);
    }

    const projectId = projectData.id || `project_${Date.now()}`;
    const project = {
      ...projectData,
      id: projectId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user.id
    };

    await kv.set(`project:${projectId}`, project);

    console.log(`Project created: ${projectId}`);
    return c.json({ success: true, project });
  } catch (error) {
    console.error('Error creating project:', error);
    return c.json({ error: 'Failed to create project' }, 500);
  }
});

// Project Endpoints - Update project
app.put("/make-server-662c70dc/projects/:id", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');

    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const accessToken = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const projectId = c.req.param('id');
    const updates = await c.req.json();

    const existingProject = await kv.get(`project:${projectId}`);

    if (!existingProject) {
      return c.json({ error: 'Project not found' }, 404);
    }

    const updatedProject = {
      ...existingProject,
      ...updates,
      id: projectId,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`project:${projectId}`, updatedProject);

    console.log(`Project updated: ${projectId}`);
    return c.json({ success: true, project: updatedProject });
  } catch (error) {
    console.error('Error updating project:', error);
    return c.json({ error: 'Failed to update project' }, 500);
  }
});

// Project Endpoints - Delete project
app.delete("/make-server-662c70dc/projects/:id", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');

    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const accessToken = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const projectId = c.req.param('id');

    await kv.del(`project:${projectId}`);

    console.log(`Project deleted: ${projectId}`);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return c.json({ error: 'Failed to delete project' }, 500);
  }
});

// AI Empire Lead Submission - Forward to local webhook server
app.post("/make-server-662c70dc/ai-empire-lead", async (c) => {
  try {
    const leadData = await c.req.json();

    console.log('🚀 AI Empire Lead Received:', leadData);

    // Forward to your local AI Empire webhook server
    const aiEmpireUrl = Deno.env.get('AI_EMPIRE_URL') || 'http://localhost:8000/api/submit-lead';
    const webhookResponse = await fetch(aiEmpireUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Supabase-Edge-Function'
      },
      body: JSON.stringify(leadData)
    });

    if (webhookResponse.ok) {
      const webhookResult = await webhookResponse.json();
      console.log('✅ AI Empire processed lead:', webhookResult);

      // Also store in Supabase for backup
      const { data, error } = await supabase
        .from('leads')
        .insert([{
          name: leadData.name,
          email: leadData.email,
          company: leadData.company,
          business_type: leadData.project_type,
          budget: parseFloat(leadData.budget?.replace(/[^0-9.]/g, '') || 0),
          timeline: leadData.timeline,
          project_type: leadData.project_type,
          description: leadData.description,
          plan: leadData.plan,
          qualification_score: webhookResult.qualification_score || 0,
          status: 'processed_by_ai_empire',
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) {
        console.error('❌ Supabase storage error:', error);
        return c.json({
          error: 'AI Empire processed but Supabase storage failed',
          ai_result: webhookResult,
          supabase_error: error
        }, 500);
      }

      return c.json({
        success: true,
        message: 'Lead processed by AI Empire',
        ai_result: webhookResult,
        supabase_id: data?.[0]?.id
      });
    } else {
      console.error('❌ AI Empire webhook error:', webhookResponse.statusText);
      return c.json({
        error: 'Failed to forward to AI Empire',
        status: webhookResponse.status
      }, 500);
    }

  } catch (error) {
    console.error('❌ Lead submission error:', error);
    return c.json({ error: 'Failed to process lead' }, 500);
  }
});

Deno.serve(app.fetch);