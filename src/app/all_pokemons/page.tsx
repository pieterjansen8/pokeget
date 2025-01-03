"use client";
import useSWR, { mutate } from "swr";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import React from "react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Home() {
  const [limit, setLimit] = useState(30);
  const [pokemonList, setPokemonList] = useState<any[]>([]);
  const { data, error, isLoading } = useSWR(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}`,
    fetcher
  );

  useEffect(() => {
    if (data) {
      setPokemonList((prevList) => [...prevList, ...data.results]);
    }
  }, [data]);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
      setLimit((prevLimit) => {
        const newLimit = prevLimit + 30 > 1025 ? 1025 : prevLimit + 30;
        if (newLimit > 60) {
          mutate(`https://pokeapi.co/api/v2/pokemon?limit=${newLimit - 60}`, undefined, { revalidate: false });
        }
        return newLimit;
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 p-4">
        <span className="text-2xl text-white text-center">
          ERROR: {(error as Error).message}
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 p-4">
      <h1 className="text-4xl font-bold text-center mb-4">All Pokemons</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {pokemonList.map((pokemon: any, index: number) => (
          <Pok img={index + 1} key={index} />
        ))}
      </div>
      {isLoading && (
        <div className="flex items-center justify-center mt-4">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
        </div>
      )}
    </div>
  );
}

const Pok = React.memo(({ img }: { img: number }) => {
  const { data, error, isLoading } = useSWR(
    `https://pokeapi.co/api/v2/pokemon/${img}`,
    fetcher
  );
  if (img > 1025 || img < 1) {
    return(
        <motion.div
            className="w-full h-full flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <span className="text-2xl text-white text-center">
              No Pokemons available above 1025 (:
            </span>
        </motion.div>
    )
  }
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
});

Pok.displayName = "Pok";
