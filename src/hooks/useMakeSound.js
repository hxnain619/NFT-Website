import { Howl } from "howler";

export default function useMakeNotificationSound() {
  return (file) => {
    try {
      const iphoneSound = new Howl({
        src: `/${file}`,
        html5: true,
        format: ["mp3", "aac"],
      });

      iphoneSound.play();
    } catch (e) {
      console.warn(e);
    }
  };
}
