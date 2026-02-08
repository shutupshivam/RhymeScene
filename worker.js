export default {
  fetch(request) {
    return new Response("Rhyme Scene worker is live.", {
      headers: { "content-type": "text/plain" },
    });
  },
};
