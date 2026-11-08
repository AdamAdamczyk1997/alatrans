import type { ImageMetadata } from 'astro';
import blackCar from '../../photos/realizacje/laweta-czarny-samochod-na-parkingu.webp';
import motorcycle from '../../photos/realizacje/laweta-niebieski-motocykl-na-platformie.webp';
import winterFront from '../../photos/realizacje/laweta-bialy-samochod-w-zimie-przod.webp';
import minivan from '../../photos/realizacje/laweta-szary-minivan-na-platformie.webp';
import blueEstate from '../../photos/realizacje/laweta-niebieskie-kombi-na-platformie.webp';
import caravanYard from '../../photos/realizacje/laweta-przy-przyczepie-kempingowej-na-placu.webp';
import darkCar from '../../photos/realizacje/laweta-ciemne-auto-przy-zabudowaniach.webp';
import greyCar from '../../photos/realizacje/laweta-szary-suv-na-platformie.webp';
import darkSedan from '../../photos/realizacje/laweta-ciemny-sedan-na-placu.webp';
import caravanRoadside from '../../photos/realizacje/laweta-przy-przyczepie-kempingowej-pobocze-ujecie-2.webp';
import winterRear from '../../photos/realizacje/laweta-bialy-samochod-w-zimie-tyl.webp';
import { photos } from './photos';

interface GalleryPhoto {
  id: string;
  image: ImageMetadata;
  alt: string;
}

// This is the gallery's single rendering order. It is used only by /realizacje/.
// Caravan photographs describe the scene, without offering caravan transport.
export const galleryPhotos = [
  {
    id: 'laweta-czarny-samochod-na-parkingu',
    image: blackCar,
    alt: 'Ciemny samochód osobowy na platformie lawety AlaTrans na parkingu',
  },
  {
    id: 'laweta-niebieski-motocykl-na-platformie',
    image: motorcycle,
    alt: 'Niebieski motocykl zabezpieczony na platformie lawety AlaTrans',
  },
  {
    id: 'laweta-bialy-samochod-w-zimie-przod',
    image: winterFront,
    alt: 'Laweta AlaTrans z jasnym samochodem osobowym w zimowym otoczeniu',
  },
  {
    id: 'laweta-szary-minivan-na-platformie',
    image: minivan,
    alt: 'Szary samochód typu minivan na platformie lawety AlaTrans',
  },
  {
    id: 'laweta-niebieskie-kombi-na-platformie',
    image: blueEstate,
    alt: 'Niebieski samochód kombi na platformie lawety AlaTrans',
  },
  {
    id: 'laweta-przy-przyczepie-kempingowej-na-placu',
    image: caravanYard,
    alt: 'Laweta AlaTrans stojąca obok przyczepy kempingowej na placu',
  },
  {
    id: 'laweta-ciemne-auto-przy-zabudowaniach',
    image: darkCar,
    alt: 'Ciemny samochód osobowy na lawecie AlaTrans przy zabudowaniach',
  },
  {
    id: 'laweta-szary-suv-na-platformie',
    image: greyCar,
    alt: 'Szary samochód na platformie lawety AlaTrans',
  },
  {
    id: 'laweta-ciemny-sedan-na-placu',
    image: darkSedan,
    alt: 'Ciemny samochód osobowy na platformie lawety AlaTrans na placu',
  },
  {
    id: 'laweta-przy-przyczepie-kempingowej-pobocze-ujecie-2',
    image: caravanRoadside,
    alt: 'Przyczepa kempingowa przy drodze, a za nią laweta AlaTrans',
  },
  {
    id: 'laweta-bialy-samochod-w-zimie-tyl',
    image: winterRear,
    alt: 'Jasny samochód osobowy na lawecie w zimowym otoczeniu, widok od tyłu',
  },
  {
    id: 'laweta_car_1',
    image: photos.laweta_car_1,
    alt: 'Laweta AlaTrans z jasnym samochodem osobowym na platformie',
  },
  {
    id: 'laweta_car_3',
    image: photos.laweta_car_3,
    alt: 'Laweta AlaTrans z uszkodzonym samochodem osobowym na platformie nocą',
  },
  {
    id: 'laweta_car_4',
    image: photos.laweta_car_4,
    alt: 'Laweta AlaTrans z widoczną kabiną i pustą platformą',
  },
  {
    id: 'laweta_car_5',
    image: photos.laweta_car_5,
    alt: 'Laweta AlaTrans z pustą platformą, widok z przodu i z boku',
  },
  {
    id: 'laweta_car_7',
    image: photos.laweta_car_7,
    alt: 'Laweta AlaTrans z niebieskim samochodem osobowym na platformie',
  },
] as const satisfies readonly GalleryPhoto[];
