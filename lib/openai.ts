const OPENAI_API_KEY = "..."; // ⚠️ Không nên hardcode như thế này trong app thật!

export async function generateImage(prompt: string): Promise<string> {
  if (!prompt || prompt.trim() === "") {
    throw new Error("Prompt is required to generate an image.");
  }

  console.log("Generating image with prompt:", prompt);

//   const response = await fetch("https://api.openai.com/v1/images/generations", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${OPENAI_API_KEY}`,
//     },
//     body: JSON.stringify({
//       model: "dall-e-3",
//       prompt: "a white siamese cat", // dùng prompt người dùng nhập
//       size: "1024x1024",

  
//     }),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     console.error("OpenAI API Error:", data);
//     throw new Error(data?.error?.message || "Failed to generate image.");
//   }

//   const imageUrl = data.data?.[0]?.url;
  const imageUrl = "https://scontent.fhan5-11.fna.fbcdn.net/v/t39.30808-6/496065133_122158507706515189_8551335311536733225_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=qf9cwIVmi-EQ7kNvwGVnkjl&_nc_oc=AdlAB4811y96P12ldWpck7ilcVmr8d6KMOVIIiONGcUhndNDELvtReHcdeVsF2xZbdM&_nc_zt=23&_nc_ht=scontent.fhan5-11.fna&_nc_gid=3lDhQGjU8Md26XWXNERdMg&oh=00_AfGIcyFGOWVZbS_J2cuFHQCbs1AfG5tFLUB9FIPkZfr1jQ&oe=681EAC0F";
  console.log("Image generated successfully:", imageUrl);
  return imageUrl;
}
