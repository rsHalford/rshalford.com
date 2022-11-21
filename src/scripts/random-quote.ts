const quotes = [
  "It is pitch black. You are likely to be eaten by a Grue.",
  "A hollow voice says 'Fool'.",
  "I have no idea what you're trying to find here.",
  "We will explore this area later on. We should continue on our quest.",
  "dead end.",
  "You were eaten by a Grue.",
  "Time is an illusion. This page doubly so.",
  "You are lost in a maze of twisty passages, all alike.",
  "Oh boy, are we going to try something dangerous now?",
  "There’s no point in acting surprised about it.",
  "If I asked you where the hell we were, would I regret it?",
  "You know, it's at times like this, when I'm trapped in a Vogon airlock with a man from Betelgeuse, and about to die of asphyxiation in deep space that I really wish I'd listened to what my mother told me when I was young.",
  "We apologize for the inconvenience.",
  "A common mistake that people make when trying to design something completely foolproof is to underestimate the ingenuity of complete fools.",
];

const randomQuote =
  adventureQuotes[Math.floor(Math.random() * adventureQuotes.length)];

const element = document.getElementById("adventureQuote");

element.innerHTML = randomQuote;
