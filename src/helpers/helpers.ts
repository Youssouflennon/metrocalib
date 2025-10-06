export function test() {
  return null;
}

export function vigenere(message: string, cle: string, operation: string) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  message = message.toUpperCase();
  cle = cle.toUpperCase();
  let key = "";
  for (let i = 0; i < message.length; i++) {
    key += cle.charAt(i % cle.length);
  }
  if (operation == "chiffrement") {
    let result = "";
    for (let i = 0; i < message.length; i++) {
      if (!alphabet.includes(message.charAt(i))) {
        result += message.charAt(i);
      } else {
        let index =
          (alphabet.indexOf(message.charAt(i)) +
            alphabet.indexOf(key.charAt(i))) %
          26;
        result += alphabet.charAt(index);
      }
    }
    return result;
  } else if (operation == "dechiffrement") {
    let result = "";
    for (let i = 0; i < message.length; i++) {
      if (!alphabet.includes(message.charAt(i))) {
        result += message.charAt(i);
      } else {
        let index =
          (alphabet.indexOf(message.charAt(i)) -
            alphabet.indexOf(key.charAt(i)) +
            26) %
          26;
        result += alphabet.charAt(index);
      }
    }
    return result;
  } else {
    return "Opération invalide. Veuillez entrer 'chiffrement' ou 'dechiffrement'.";
  }
}

export function debounceTime(func: Function, delay: number): Function {
  let timerId: ReturnType<typeof setTimeout>;

  return (...args: any[]) => {
    clearTimeout(timerId);
    // @ts-ignore
    timerId = setTimeout(() => func.apply(this, args), delay);
  };
}

export const permut = (tab: any[], i: number, j: number) => {
  let c = tab[i];
  tab[i] = tab[j];
  tab[j] = c;
};

export function getOS() {
  const { userAgent } = window.navigator;
  const { platform } = window.navigator;
  const macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"];
  const windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"];
  const iosPlatforms = ["iPhone", "iPad", "iPod"];
  let os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = "MacOS";
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = "iOS";
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = "Windows";
  } else if (/Android/.test(userAgent)) {
    os = "Android";
  } else if (!os && /Linux/.test(platform)) {
    os = "Linux";
  }

  // @ts-ignore
  document.documentElement.setAttribute("os", os);
  return os;
}

export const hasNotch = () => {
  /**
   * For storybook test
   */
  const storybook = window.location !== window.parent.location;
  // @ts-ignore
  const iPhone = /iPhone/.test(navigator.userAgent) && !window.MSStream;
  const aspect = window.screen.width / window.screen.height;
  const aspectFrame = window.innerWidth / window.innerHeight;
  return (
    (iPhone && aspect.toFixed(3) === "0.462") ||
    (storybook && aspectFrame.toFixed(3) === "0.462")
  );
};

export const mergeRefs = (refs: any[]) => {
  return (value: any) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        ref.current = value;
      }
    });
  };
};

export const randomColor = () => {
  const colors = [
    "primary",
    "secondary",
    "success",
    "info",
    "warning",
    "danger",
  ];

  const color = Math.floor(Math.random() * colors.length);

  return colors[color];
};

export const priceFormat = (price: number) => {
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

export const average = (array: any[]) =>
  array.reduce((a, b) => a + b) / array.length;

export const percent = (value1: number, value2: number) =>
  Number(((value1 / value2 - 1) * 100).toFixed(2));

export const getFirstLetter = (text: string, letterCount = 2): string =>
  // @ts-ignore
  text
    .toUpperCase()
    .match(/\b(\w)/g)
    .join("")
    .substring(0, letterCount);

export const debounce = (func: (arg0: any) => void, wait = 1000) => {
  let timeout: string | number | NodeJS.Timeout | undefined;

  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      // @ts-ignore
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const base64ToFile = (base64: string, type: string) => {
  const base = `data:${type};base64,${base64}`;
  const binaryString = window.atob(base.split(",")[1]);
  const length = binaryString.length;
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const arrayBuffer = bytes.buffer;

  // Conversion de l'ArrayBuffer en blob
  const blob = new Blob([arrayBuffer], { type: type });

  return blob;
};

function readImage(file: File) {
  const reader = new FileReader();

  reader.onload = function (e) {
    console.log(e.target?.result);
    // setImage(e.target?.result) ;
  };

  reader.readAsDataURL(file);
}

/**
 * Bind params to a given url
 * @param to
 * @param params
 */
export const joinUrlWithParams = (
  to: string,
  params: Array<{ param: string; value: any }>
) => {
  let url = to;
  params.forEach((param) => {
    url = url.replace(`:${param.param}`, `${encodeURIComponent(param.value)}`);
  });

  return url;
};

/**
 * Shortcut of joinUrlWithParams for Id
 * @param to
 * @param id
 */
export const joinUrlWithParamsId = (to: string, id: string | number) =>
  joinUrlWithParams(to, [{ param: "id", value: id }]);

/** Type pour la table des couleurs */
const letterColors: Record<string, string> = {
  A: "#FF5733",
  B: "#33FF57",
  C: "#3357FF",
  D: "#FF33A8",
  E: "#FFD700",
  F: "#FF8C00",
  G: "#4B0082",
  H: "#008080",
  I: "#800000",
  J: "#0000FF",
  K: "#DC143C",
  L: "#008000",
  M: "#808000",
  N: "#A52A2A",
  O: "#7FFF00",
  P: "#D2691E",
  Q: "#00FFFF",
  R: "#FF4500",
  S: "#8A2BE2",
  T: "#20B2AA",
  U: "#FF6347",
  V: "#8B4513",
  W: "#9400D3",
  X: "#228B22",
  Y: "#1E90FF",
  Z: "#9932CC",
};

/** Fonction TypeScript pour récupérer la couleur associée à une lettre */
export const getColorForLetter = (letter: string): string => {
  if (!letter) return "#CCCCCC"; // Retourne une couleur par défaut si pas de lettre
  const upperLetter = letter.toUpperCase();
  return letterColors[upperLetter] || "#CCCCCC"; // Défaut si la lettre n'est pas trouvée
};

export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals: { [key: string]: number } = {
    année: 31536000,
    mois: 2592000,
    semaine: 604800,
    jour: 86400,
    heure: 3600,
    minute: 60,
    seconde: 1,
  };

  for (const [unit, value] of Object.entries(intervals)) {
    const count = Math.floor(seconds / value);
    if (count >= 1) {
      return `il y a ${count} ${unit}${count > 1 ? "s" : ""}`;
    }
  }

  return "à l'instant";
};

const cardBackgroundImages = [
  "/1.jpg",
  "/2.jpg",
  "/3.jpg",
  "/4.jpg",
  "/5.jpg",
  "/6.jpg",
  "/7.jpg",
  "/8.jpg",
  "/9.jpg",
  "/10.jpg",
];

export const getRandomImage = () => {
  const index = Math.floor(Math.random() * cardBackgroundImages.length);
  return cardBackgroundImages[index];
};

