import axios from 'axios';

export const backEndUrl = process.env.BACKEND_URL;

export const backendCall = async req => {
  try {
    const response = await axios({
      method: req.method,
      url: backEndUrl + req.originalUrl,
      data: req.body,
      headers: req.headers,
    });
    return response.data;
  } catch (error) {
    const { status, data } = error.response || {};
    throw { status, data };
  }
};

export async function forwardToBackend(req, res) {
  try {
    const response = await backendCall(req);
    res.json(response);
  } catch (error) {
    console.log(`🌞 ${req.originalUrl} controler error`, error);
    res.status(500).json(error.data);
  }
}
