export default async function postRedacao(redacao) {
  await fetch("/post-redacao", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(redacao),
  });
}
