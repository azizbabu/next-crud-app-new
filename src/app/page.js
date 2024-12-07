"use client"

import React, { useEffect } from 'react';
import {useTranslations} from 'next-intl';
import Link from 'next/link'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setCountryList, setPostList } from '@/store/commonSlice';
import { selectCommon } from '@/store';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const dispatch = useDispatch();
  const { countryList, postList } = useSelector(selectCommon);
  console.log('countryList', countryList)

  // Fetch countryList and postList data when the component mounts
  useEffect(() => {
    async function fetchDropdownData() {
      try {
        // Fetch countries
        const response = await axios.get(`${API_BASE_URL}/common-dropdown`); 
        if (response.data.success) {
          dispatch(setCountryList(response.data.data.countryList));
          dispatch(setPostList(response.data.data.postList));
        }
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    }

    fetchDropdownData();
  }, [dispatch]);

  const t = useTranslations('HomePage');
  return (
    <div>
      <h1 className="text-3xl font-bold">{t('welcome')}</h1>
      <nav className="mt-4">
        <ul className="space-y-2">
          <li>
            <Link href="/countries" className="text-blue-500 hover:underline">
              { t('country_list') }
            </Link>
          </li>
          <li>
            <Link href="/users" className="text-blue-500 hover:underline">
            { t('user_list') }
            </Link>
          </li>
          <li>
            <Link href="/posts" className="text-blue-500 hover:underline">
            { t('post_list') }
            </Link>
          </li>
        </ul>
      </nav>
    </div> 
  );
}
