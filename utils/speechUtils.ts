// Ensure the SpeechSynthesis API is available
const isSpeechSynthesisSupported = 'speechSynthesis' in window;

/**
 * Speaks the given text using the Web Speech API.
 * @param text The text to speak.
 * @param lang The language to use (default: 'en-US').
 */
export const speakText = (text: string, lang: string = 'en-US') => {
  if (!isSpeechSynthesisSupported) {
    console.warn('SpeechSynthesis API not supported in this browser.');
    return;
  }

  // Cancel any ongoing speech to avoid overlap
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.8; // Slightly slower for toddlers
  utterance.pitch = 1.0;

  // Optional: Select a specific voice if available
  // const voices = window.speechSynthesis.getVoices();
  // const desiredVoice = voices.find(voice => voice.name === 'Google US English'); // Example
  // if (desiredVoice) {
  //   utterance.voice = desiredVoice;
  // }

  window.speechSynthesis.speak(utterance);
};

/**
 * Stops any ongoing speech.
 */
export const stopSpeaking = () => {
  if (isSpeechSynthesisSupported) {
    window.speechSynthesis.cancel();
  }
};
