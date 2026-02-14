/**
 * LOA API Service
 * Handles all LOA (Legal Operating Agreement) API communications
 */

class LoaApi {
  constructor() {
    this.baseUrl = process.env.VITE_API_URL || 'https://darnley-sanons-projects-production.up.railway.app';
    this.apiKey = process.env.OPENAI_API_KEY;
  }

  async generateDocument(template, data) {
    try {
      const response = await fetch(`${this.baseUrl}/api/documents/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({ template, data })
      });
      return await response.json();
    } catch (error) {
      console.error('LOA API Error:', error);
      throw error;
    }
  }

  async validateDocument(documentId) {
    try {
      const response = await fetch(`${this.baseUrl}/api/documents/${documentId}/validate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Document validation error:', error);
      throw error;
    }
  }
}

export default new LoaApi();
