"use client";

// next js
import Link from "next/link";
import Image from "next/image";

// react hooks
import { useState } from "react";

// icons
import { Search, Trees } from "lucide-react";

// shadcn ui components
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import ModeToggle from "@/components/general/ThemeSwitcher";

// types
import { Country } from "@/types/country";

// data fetching
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { GetDataFromQuery } from "@/lib/api/getDataFromQuery";

export default function RootPage() {
  const [regions, setRegions] = useState(false);
  const [searchableCountries, setSearchableCountries] = useState<Country[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // react query mutation for region funtionality
  const regionMutation = useMutation({
    mutationFn: async (region: string) =>
      await axios.get(`https://restcountries.com/v3.1/${region}`),
    onError: (error, variables, context) => {
      console.log(error);
    },
    onSuccess: (data, variables, context) => {},
  });
  const regionizeCountry = regionMutation.data?.data as Country[];

  // react query data fetching for showing contries with useQuery
  const { data, refetch, isError, isFetching, isPending } = GetDataFromQuery({
    out: true,
    key: "countriesAll",
    url: `https://restcountries.com/v3.1/all`,
    isFeature: false,
  });
  const country: Country[] = data;

  // changing region functionality
  const handleChange = (value: string) => {
    regionMutation.mutate(value);
    setRegions(true);
  };

  // searching country functionality
  const handleSearch = (event: any) => {
    const value = event.target.value;
    setSearchTerm(value);
    const filteredCountries = (regions ? regionizeCountry : country).filter(
      (country) =>
        country.name.official.toLowerCase().includes(value.toLowerCase())
    );
    setSearchableCountries(filteredCountries);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Trees className="h-6 w-6" />
            <span className="sr-only">Ehsan Inc</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base text-nowrap"
          >
            Where In The World !
          </Link>
        </nav>

        <div className="flex items-center gap-4 md:gap-2 lg:gap-4">
          <ModeToggle />
        </div>
      </header>
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:justify-between">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search for a country...  "
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>

          <Select onValueChange={handleChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Region</SelectLabel>
                <SelectItem value="all">All Countries</SelectItem>
                <SelectItem value="region/africa">Africa</SelectItem>
                <SelectItem value="region/asia">Asia</SelectItem>
                <SelectItem value="region/europe">Europe</SelectItem>
                <SelectItem value="region/antarctic">Antarctic</SelectItem>
                <SelectItem value="region/americas">Americas</SelectItem>
                <SelectItem value="region/oceania">Oceania</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap gap-6">
          {isPending && <div>Loading...</div>}
          {isError && <div>Error happened during fetching data...</div>}
          {regionMutation.isPending && <div>Loading ...</div>}
          {(searchTerm
            ? searchableCountries
            : regions
            ? regionizeCountry
            : country
          )?.map((item) => {
            return (
              <Card key={item.name.official}>
                <CardHeader>
                  <Image
                    alt="country"
                    src={item.flags.png}
                    height={100}
                    width={200}
                    className="rounded-t-md w-[250px] sm:w-[300px] aspect-video"
                  />
                </CardHeader>
                <CardContent className="sm:w-[300px] w-[250px]">
                  <h2 className="font-bold my-6">{item.name.official}</h2>
                  <div>
                    <strong>Population:</strong>{" "}
                    {item.population.toLocaleString()}
                  </div>
                  <div className="">
                    <strong>Region:</strong> {item.region}
                  </div>
                  <div>
                    <strong>Capital:</strong> {item.capital}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
