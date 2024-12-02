'use client';

import { useState, useTransition } from 'react';
import { setUserLocale } from '@/services/locale';

export default function LocaleSwitcherSelect({ defaultValue, items, label }) {
  const [isPending, startTransition] = useTransition();
  const [selectedLocale, setSelectedLocale] = useState(defaultValue);

  function onChange(event) {
    const value = event.target.value;
    setSelectedLocale(value);
    startTransition(() => {
      setUserLocale(value);
    });
  }

  return (
    <div className="relative w-20">
      <label htmlFor="locale-switcher" className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id="locale-switcher"
        value={selectedLocale}
        onChange={onChange}
        disabled={isPending}
        className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      >
        {items.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}
