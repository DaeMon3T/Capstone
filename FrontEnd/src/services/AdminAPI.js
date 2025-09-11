const API_BASE = "http://localhost:8000/api/v1";

export async function getAdminStats() {
  const response = await fetch(`${API_BASE}/admin/stats/`, {
    headers: { 
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      'Content-Type': 'application/json' 
    }
  });
  return await response.json();
}

export async function searchUsers(query) {
  const response = await fetch(`${API_BASE}/admin/search/?q=${query}`, {
    headers: { 
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      'Content-Type': 'application/json' 
    }
  });
  return await response.json();
}

export async function inviteUser(email, role) {
  const response = await fetch(`${API_BASE}/admin/invite-user/`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify({ email, role })
  });
  return await response.json();
}