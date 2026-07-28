export function getApiBaseUrl() {
  const configuredUrl = import.meta.env.VITE_API_BASE_URL?.trim();
  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, '');
  }

  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();
  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev`;
  }

  return 'http://localhost:8000';
}

export function normalizeResponse(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (value?.data && Array.isArray(value.data)) {
    return value.data;
  }

  if (value?.items && Array.isArray(value.items)) {
    return value.items;
  }

  return [];
}

export async function fetchResource(resourceName) {
  const response = await fetch(`${getApiBaseUrl()}/api/${resourceName}/`);
  if (!response.ok) {
    throw new Error(`Failed to load ${resourceName}: ${response.statusText}`);
  }

  const payload = await response.json();
  return normalizeResponse(payload);
}
