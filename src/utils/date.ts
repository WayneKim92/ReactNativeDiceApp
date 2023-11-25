import {format} from 'date-fns';
import {ko, ja, enUS} from 'date-fns/locale';

// 한국어 날짜와 시간 포맷
export const koreanDateFormat = (date: Date) => {
  try {
    return format(date, 'yyyy년 MM월 dd일 EEEE HH:mm:ss', {
      locale: ko,
    });
  } catch (e) {
    console.log('e', e);
    return '';
  }
};

// 일본어 날짜와 시간 포맷
export const japaneseDateFormat = (date: Date) =>
  format(date, 'yyyy年 MM月 dd日 EEEE HH:mm:ss', {
    locale: ja,
  });

// 영어(미국) 날짜와 시간 포맷
export const englishUSDateFormat = (date: Date) =>
  format(date, 'MMMM do, yyyy EEEE HH:mm:ss', {
    locale: enUS,
  });
