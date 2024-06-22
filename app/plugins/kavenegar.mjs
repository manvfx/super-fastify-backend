import fp from 'fastify-plugin';
import Kavenegar from 'kavenegar';

export async function kavenegarPlugin(fastify, options) {
  const kavenegar = Kavenegar.KavenegarApi({
    apikey: options.apiKey
  });

  fastify.decorate('kavenegar', kavenegar);
}

export default fp(kavenegarPlugin);
