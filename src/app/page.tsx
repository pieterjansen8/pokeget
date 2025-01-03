"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import useSWR from "swr";
const fetcher = (url: string) => fetch(url).then((r) => r.json());
export default function Home() {
  const [image, setImage] = useState(1);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 p-4">
      <motion.h1
        className="text-5xl font-bold mb-12 text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Fetch your Pokémon
      </motion.h1>
      <motion.div
        className="w-full max-w-md aspect-square mb-8 bg-gray-800 rounded-2xl p-6 shadow-lg flex flex-col overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Pok img={image} />
      </motion.div>
      <div className="flex gap-4">
        <Button
          onClick={() => setImage((old) => Math.max(1, old - 1))}
          className="bg-slate-800 hover:bg-slate-700 text-white transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          <ArrowLeft className="mr-2" />
          Previous
        </Button>
        <Button
          onClick={() => setImage((old) => old + 1)}
          className="bg-slate-800 hover:bg-slate-700 text-white transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Next
          <ArrowRight className="ml-2" />
        </Button>
      </div>
      <div className="flex-grow mt-4">
        <Input
          type="number"
          onChange={(e) => {
            setImage(Number(e.target.value));
          }}
          placeholder="Pokemon id"
        ></Input>
      </div>
      <span className="float-start mt-6 text-xl">
        <Link
          href={"/all_pokemons"}
          className="text-blue-500 underline"
        >
          All pokemons
        </Link>{" "}
      </span>
      <span className="float-start mt-6 text-xl">
        created by{" "}
        <Link
          href={"https://github.com/pieterjansen8"}
          className="text-blue-500 underline"
        >
          pieter jansen
        </Link>{" "}
      </span>
    </div>
  );
}

function Pok({ img }: { img: number }) {
  if (img > 1025 || img < 1) {
    return (
      <motion.div
        className="w-full h-full flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-2xl text-white text-center">
          ERROR: Pokemon not found
        </span>
      </motion.div>
    );
  }
  const { data, error, isLoading } = useSWR(
    `https://pokeapi.co/api/v2/pokemon/${img}`,
    fetcher
  );
  if (error) {
    return (
      <motion.div
        className="w-full h-full flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-2xl text-white text-center">
          ERROR: {(error as Error).message}
        </span>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <motion.div
        className="w-full h-full flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Loader2 className="w-12 h-12 text-white animate-spin" />
      </motion.div>
    );
  }

  if (data) {
    return (
      <motion.div
        className="flex flex-col h-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-4 text-center capitalize text-white">
          {data.forms[0].name}
        </h2>
        <div className="flex-grow flex items-center justify-center bg-gray-700 rounded-xl overflow-hidden mb-4 p-4">
          <motion.img
            className="max-w-full max-h-full object-contain filter drop-shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            alt={`Pokemon ${img}`}
            src={data.sprites.other.home.front_default}
          />
        </div>
        <span className="text-xl text-center font-semibold text-gray-300">
          Pokémon #{img}
        </span>
      </motion.div>
    );
  }

  return null;
}
