import httpProxyMiddleware from 'next-http-proxy-middleware';
import { NextApiRequest, NextApiResponse } from 'next';

const API_SERVICE_URL = "https://graphql.looksrare.org/graphql";

export default function handler (req: NextApiRequest, res: NextApiResponse) {
    return httpProxyMiddleware(req, res, {
        target: API_SERVICE_URL,
        changeOrigin: true
    })
}
