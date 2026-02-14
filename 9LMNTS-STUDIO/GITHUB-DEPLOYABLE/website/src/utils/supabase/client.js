/**
 * Supabase Client
 * Database connection and utilities
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database operations
export const dbOperations = {
  // Projects
  async createProject(projectData) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Database error creating project:', error);
      throw error;
    }
  },

  async getProjects(clientId) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Database error getting projects:', error);
      throw error;
    }
  },

  // Clients
  async createClient(clientData) {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([clientData])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Database error creating client:', error);
      throw error;
    }
  },

  async getClientByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Database error getting client:', error);
      throw error;
    }
  },

  // Authentication
  async signUp(email, password) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Auth error signing up:', error);
      throw error;
    }
  },

  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Auth error signing in:', error);
      throw error;
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Auth error signing out:', error);
      throw error;
    }
  }
};

export default supabase;
