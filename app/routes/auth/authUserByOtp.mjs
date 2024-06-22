import fp from "fastify-plugin";

async function sendSmsAuth(fastify, options) {
  fastify.post('/send-sms', {
    schema: {
      body: {
        type: 'object',
        required: ['to', 'message'],
        properties: {
          to: { type: 'string' },
          message: { type: 'string' },
        },
      },
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            status: { type: 'string' },
          },
        },
      },
    },
    handler: async (request, reply) => {
      const { to, message } = request.body;

      // Assuming fastify.kavenegar is already initialized and available
      fastify.kavenegar.Send(
        {
          message: message,
          sender: '1000596446',
          receptor: to,
        },
        function (response, status) {
          if (status === 200) {
            reply.send({ status: 'Message sent successfully' });
          } else {
            reply.status(500).send({ status: 'Message failed to send' });
          }
        }
      );
    },
  });
}

export default fp(sendSmsAuth);