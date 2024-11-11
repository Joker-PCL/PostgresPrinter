const _HOST = import.meta.env.VITE_HOSTNAME;
const _WEB_LINK = import.meta.env.VITE_WEB_LINK;

export const API_URL = {
  CONTENT_TYPE: { 'Content-Type': 'application/json; charset=utf-8' },
  HAND_SHAKE: `${_HOST}/handshake`,
  GET_DASHBOARD: `${_HOST}/${_WEB_LINK}/dashboard`,
  LOGIN: `${_HOST}/login`,
  LOGOUT: `${_HOST}/logout`,
  GET_PRODUCTION: `${_HOST}/${_WEB_LINK}/production`,
  POST_PRODUCTION_UPDATE: `${_HOST}/${_WEB_LINK}/production/update`,
  POST_PRODUCTION_DELETE: `${_HOST}/${_WEB_LINK}/production/delete`,
  GET_PRODUCT_LISTS: `${_HOST}/${_WEB_LINK}/productLists`,
  GET_MACHINE_LISTS: `${_HOST}/${_WEB_LINK}/machineLists`,
  GET_DETAILS: `${_HOST}/${_WEB_LINK}/details`,
};
