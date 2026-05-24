import { TbBeach, TbMountain, TbPool } from "react-icons/tb";
import {
  GiBarn,
  GiBoatFishing,
  GiCactus,
  GiCastle,
  GiCaveEntrance,
  GiForestCamp,
  GiIsland,
  GiWindmill,
} from "react-icons/gi";
import { FaSkiing } from "react-icons/fa";
import { BsSnow } from "react-icons/bs";
import { IoDiamond } from "react-icons/io5";
import { MdOutlineVilla } from "react-icons/md";

export const categories = [
  {
    label: "Beach",
    labelJa: "ビーチ",
    icon: TbBeach,
    description: "This property is close to the beach!",
  },
  {
    label: "Windmills",
    labelJa: "風車",
    icon: GiWindmill,
    description: "This property has a windmills!",
  },
  {
    label: "Modern",
    labelJa: "モダン",
    icon: MdOutlineVilla,
    description: "This property is modern!",
  },
  {
    label: "Countryside",
    labelJa: "田園",
    icon: TbMountain,
    description: "This property is in the countryside!",
  },
  {
    label: "Pools",
    labelJa: "プール",
    icon: TbPool,
    description: "This is property has a beautiful pool!",
  },
  {
    label: "Islands",
    labelJa: "島",
    icon: GiIsland,
    description: "This property is on an island!",
  },
  {
    label: "Lake",
    labelJa: "湖",
    icon: GiBoatFishing,
    description: "This property is near a lake!",
  },
  {
    label: "Skiing",
    labelJa: "スキー",
    icon: FaSkiing,
    description: "This property has skiing activies!",
  },
  {
    label: "Castles",
    labelJa: "城",
    icon: GiCastle,
    description: "This property is an ancient castle!",
  },
  {
    label: "Caves",
    labelJa: "洞窟",
    icon: GiCaveEntrance,
    description: "This property is in a spooky cave!",
  },
  {
    label: "Camping",
    labelJa: "キャンプ",
    icon: GiForestCamp,
    description: "This property offers camping activities!",
  },
  {
    label: "Arctic",
    labelJa: "北極",
    icon: BsSnow,
    description: "This property is in arctic environment!",
  },
  {
    label: "Desert",
    labelJa: "砂漠",
    icon: GiCactus,
    description: "This property is in the desert!",
  },
  {
    label: "Barns",
    labelJa: "納屋",
    icon: GiBarn,
    description: "This property is in a barn!",
  },
  {
    label: "Lux",
    labelJa: "ラグジュアリー",
    icon: IoDiamond,
    description: "This property is brand new and luxurious!",
  },
];

export const LISTINGS_BATCH = 16;

export const menuItems = [
  {
    label: "旅行",
    path: "/trips",
  },
  {
    label: "お気に入り",
    path: "/favorites",
  },
  {
    label: "予約管理",
    path: "/reservations",
  },
  {
    label: "物件管理",
    path: "/properties",
  },
];
