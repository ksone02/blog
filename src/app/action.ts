/* eslint-disable no-console */

'use server';

import privateClient from '@/lib/supabase/private';

export const getViewCount = async (slug: string) => {
  try {
    const { data, error } = await privateClient.rpc('get_views', {
      page_pathname: slug,
    });

    if (error) {
      throw new Error(`조회수 가져오기 실패: ${error.message}`);
    }

    return {
      success: true,
      views: data,
    };
  } catch (error) {
    console.error('조회수 가져오기 중 에러 발생:', error);
    return {
      success: false,
      error: '조회수를 가져오는데 실패했습니다.',
    };
  }
};

export const incrementViewCount = async (slug: string) => {
  try {
    const headers = new Headers();
    const ip = headers.get('x-forwarded-for')?.split(',')[0] ?? '127.0.0.1';

    const { error } = await privateClient.rpc('new_visitor', {
      page_pathname: slug,
      user_ip: ip,
    });

    if (error) {
      throw new Error(`조회수 증가 실패: ${error.message}`);
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('조회수 증가 중 에러 발생:', error);
    return {
      success: false,
      error: '조회수를 증가시키는데 실패했습니다.',
    };
  }
};
