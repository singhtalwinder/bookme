'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { BubbleBackground } from '@/components/ui/bubble-background';
import { Logo } from '@/components/logo';
import { AuthFooter } from '@/components/auth-footer';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, ChevronLeft, ChevronRight, User, Building2, Briefcase, MapPin, Laptop, MessageSquare, Check } from 'lucide-react';

// Country codes list (comprehensive, sorted by code)
const COUNTRY_CODES = [
  { code: '+1', country: 'US', flag: '🇺🇸', name: 'United States' },
  { code: '+1', country: 'CA', flag: '🇨🇦', name: 'Canada' },
  { code: '+7', country: 'RU', flag: '🇷🇺', name: 'Russia' },
  { code: '+20', country: 'EG', flag: '🇪🇬', name: 'Egypt' },
  { code: '+27', country: 'ZA', flag: '🇿🇦', name: 'South Africa' },
  { code: '+30', country: 'GR', flag: '🇬🇷', name: 'Greece' },
  { code: '+31', country: 'NL', flag: '🇳🇱', name: 'Netherlands' },
  { code: '+32', country: 'BE', flag: '🇧🇪', name: 'Belgium' },
  { code: '+33', country: 'FR', flag: '🇫🇷', name: 'France' },
  { code: '+34', country: 'ES', flag: '🇪🇸', name: 'Spain' },
  { code: '+36', country: 'HU', flag: '🇭🇺', name: 'Hungary' },
  { code: '+39', country: 'IT', flag: '🇮🇹', name: 'Italy' },
  { code: '+40', country: 'RO', flag: '🇷🇴', name: 'Romania' },
  { code: '+41', country: 'CH', flag: '🇨🇭', name: 'Switzerland' },
  { code: '+43', country: 'AT', flag: '🇦🇹', name: 'Austria' },
  { code: '+44', country: 'GB', flag: '🇬🇧', name: 'United Kingdom' },
  { code: '+45', country: 'DK', flag: '🇩🇰', name: 'Denmark' },
  { code: '+46', country: 'SE', flag: '🇸🇪', name: 'Sweden' },
  { code: '+47', country: 'NO', flag: '🇳🇴', name: 'Norway' },
  { code: '+48', country: 'PL', flag: '🇵🇱', name: 'Poland' },
  { code: '+49', country: 'DE', flag: '🇩🇪', name: 'Germany' },
  { code: '+51', country: 'PE', flag: '🇵🇪', name: 'Peru' },
  { code: '+52', country: 'MX', flag: '🇲🇽', name: 'Mexico' },
  { code: '+53', country: 'CU', flag: '🇨🇺', name: 'Cuba' },
  { code: '+54', country: 'AR', flag: '🇦🇷', name: 'Argentina' },
  { code: '+55', country: 'BR', flag: '🇧🇷', name: 'Brazil' },
  { code: '+56', country: 'CL', flag: '🇨🇱', name: 'Chile' },
  { code: '+57', country: 'CO', flag: '🇨🇴', name: 'Colombia' },
  { code: '+58', country: 'VE', flag: '🇻🇪', name: 'Venezuela' },
  { code: '+60', country: 'MY', flag: '🇲🇾', name: 'Malaysia' },
  { code: '+61', country: 'AU', flag: '🇦🇺', name: 'Australia' },
  { code: '+62', country: 'ID', flag: '🇮🇩', name: 'Indonesia' },
  { code: '+63', country: 'PH', flag: '🇵🇭', name: 'Philippines' },
  { code: '+64', country: 'NZ', flag: '🇳🇿', name: 'New Zealand' },
  { code: '+65', country: 'SG', flag: '🇸🇬', name: 'Singapore' },
  { code: '+66', country: 'TH', flag: '🇹🇭', name: 'Thailand' },
  { code: '+81', country: 'JP', flag: '🇯🇵', name: 'Japan' },
  { code: '+82', country: 'KR', flag: '🇰🇷', name: 'South Korea' },
  { code: '+84', country: 'VN', flag: '🇻🇳', name: 'Vietnam' },
  { code: '+86', country: 'CN', flag: '🇨🇳', name: 'China' },
  { code: '+90', country: 'TR', flag: '🇹🇷', name: 'Turkey' },
  { code: '+91', country: 'IN', flag: '🇮🇳', name: 'India' },
  { code: '+92', country: 'PK', flag: '🇵🇰', name: 'Pakistan' },
  { code: '+93', country: 'AF', flag: '🇦🇫', name: 'Afghanistan' },
  { code: '+94', country: 'LK', flag: '🇱🇰', name: 'Sri Lanka' },
  { code: '+95', country: 'MM', flag: '🇲🇲', name: 'Myanmar' },
  { code: '+98', country: 'IR', flag: '🇮🇷', name: 'Iran' },
  { code: '+212', country: 'MA', flag: '🇲🇦', name: 'Morocco' },
  { code: '+213', country: 'DZ', flag: '🇩🇿', name: 'Algeria' },
  { code: '+216', country: 'TN', flag: '🇹🇳', name: 'Tunisia' },
  { code: '+218', country: 'LY', flag: '🇱🇾', name: 'Libya' },
  { code: '+220', country: 'GM', flag: '🇬🇲', name: 'Gambia' },
  { code: '+221', country: 'SN', flag: '🇸🇳', name: 'Senegal' },
  { code: '+223', country: 'ML', flag: '🇲🇱', name: 'Mali' },
  { code: '+224', country: 'GN', flag: '🇬🇳', name: 'Guinea' },
  { code: '+225', country: 'CI', flag: '🇨🇮', name: 'Ivory Coast' },
  { code: '+226', country: 'BF', flag: '🇧🇫', name: 'Burkina Faso' },
  { code: '+227', country: 'NE', flag: '🇳🇪', name: 'Niger' },
  { code: '+228', country: 'TG', flag: '🇹🇬', name: 'Togo' },
  { code: '+229', country: 'BJ', flag: '🇧🇯', name: 'Benin' },
  { code: '+230', country: 'MU', flag: '🇲🇺', name: 'Mauritius' },
  { code: '+231', country: 'LR', flag: '🇱🇷', name: 'Liberia' },
  { code: '+232', country: 'SL', flag: '🇸🇱', name: 'Sierra Leone' },
  { code: '+233', country: 'GH', flag: '🇬🇭', name: 'Ghana' },
  { code: '+234', country: 'NG', flag: '🇳🇬', name: 'Nigeria' },
  { code: '+235', country: 'TD', flag: '🇹🇩', name: 'Chad' },
  { code: '+236', country: 'CF', flag: '🇨🇫', name: 'Central African Republic' },
  { code: '+237', country: 'CM', flag: '🇨🇲', name: 'Cameroon' },
  { code: '+238', country: 'CV', flag: '🇨🇻', name: 'Cape Verde' },
  { code: '+239', country: 'ST', flag: '🇸🇹', name: 'São Tomé and Príncipe' },
  { code: '+240', country: 'GQ', flag: '🇬🇶', name: 'Equatorial Guinea' },
  { code: '+241', country: 'GA', flag: '🇬🇦', name: 'Gabon' },
  { code: '+242', country: 'CG', flag: '🇨🇬', name: 'Republic of the Congo' },
  { code: '+243', country: 'CD', flag: '🇨🇩', name: 'Democratic Republic of the Congo' },
  { code: '+244', country: 'AO', flag: '🇦🇴', name: 'Angola' },
  { code: '+245', country: 'GW', flag: '🇬🇼', name: 'Guinea-Bissau' },
  { code: '+246', country: 'IO', flag: '🇮🇴', name: 'British Indian Ocean Territory' },
  { code: '+248', country: 'SC', flag: '🇸🇨', name: 'Seychelles' },
  { code: '+249', country: 'SD', flag: '🇸🇩', name: 'Sudan' },
  { code: '+250', country: 'RW', flag: '🇷🇼', name: 'Rwanda' },
  { code: '+251', country: 'ET', flag: '🇪🇹', name: 'Ethiopia' },
  { code: '+252', country: 'SO', flag: '🇸🇴', name: 'Somalia' },
  { code: '+253', country: 'DJ', flag: '🇩🇯', name: 'Djibouti' },
  { code: '+254', country: 'KE', flag: '🇰🇪', name: 'Kenya' },
  { code: '+255', country: 'TZ', flag: '🇹🇿', name: 'Tanzania' },
  { code: '+256', country: 'UG', flag: '🇺🇬', name: 'Uganda' },
  { code: '+257', country: 'BI', flag: '🇧🇮', name: 'Burundi' },
  { code: '+258', country: 'MZ', flag: '🇲🇿', name: 'Mozambique' },
  { code: '+260', country: 'ZM', flag: '🇿🇲', name: 'Zambia' },
  { code: '+261', country: 'MG', flag: '🇲🇬', name: 'Madagascar' },
  { code: '+262', country: 'RE', flag: '🇷🇪', name: 'Réunion' },
  { code: '+263', country: 'ZW', flag: '🇿🇼', name: 'Zimbabwe' },
  { code: '+264', country: 'NA', flag: '🇳🇦', name: 'Namibia' },
  { code: '+265', country: 'MW', flag: '🇲🇼', name: 'Malawi' },
  { code: '+266', country: 'LS', flag: '🇱🇸', name: 'Lesotho' },
  { code: '+267', country: 'BW', flag: '🇧🇼', name: 'Botswana' },
  { code: '+268', country: 'SZ', flag: '🇸🇿', name: 'Eswatini' },
  { code: '+269', country: 'KM', flag: '🇰🇲', name: 'Comoros' },
  { code: '+290', country: 'SH', flag: '🇸🇭', name: 'Saint Helena' },
  { code: '+291', country: 'ER', flag: '🇪🇷', name: 'Eritrea' },
  { code: '+297', country: 'AW', flag: '🇦🇼', name: 'Aruba' },
  { code: '+298', country: 'FO', flag: '🇫🇴', name: 'Faroe Islands' },
  { code: '+299', country: 'GL', flag: '🇬🇱', name: 'Greenland' },
  { code: '+350', country: 'GI', flag: '🇬🇮', name: 'Gibraltar' },
  { code: '+351', country: 'PT', flag: '🇵🇹', name: 'Portugal' },
  { code: '+352', country: 'LU', flag: '🇱🇺', name: 'Luxembourg' },
  { code: '+353', country: 'IE', flag: '🇮🇪', name: 'Ireland' },
  { code: '+354', country: 'IS', flag: '🇮🇸', name: 'Iceland' },
  { code: '+355', country: 'AL', flag: '🇦🇱', name: 'Albania' },
  { code: '+356', country: 'MT', flag: '🇲🇹', name: 'Malta' },
  { code: '+357', country: 'CY', flag: '🇨🇾', name: 'Cyprus' },
  { code: '+358', country: 'FI', flag: '🇫🇮', name: 'Finland' },
  { code: '+359', country: 'BG', flag: '🇧🇬', name: 'Bulgaria' },
  { code: '+370', country: 'LT', flag: '🇱🇹', name: 'Lithuania' },
  { code: '+371', country: 'LV', flag: '🇱🇻', name: 'Latvia' },
  { code: '+372', country: 'EE', flag: '🇪🇪', name: 'Estonia' },
  { code: '+373', country: 'MD', flag: '🇲🇩', name: 'Moldova' },
  { code: '+374', country: 'AM', flag: '🇦🇲', name: 'Armenia' },
  { code: '+375', country: 'BY', flag: '🇧🇾', name: 'Belarus' },
  { code: '+376', country: 'AD', flag: '🇦🇩', name: 'Andorra' },
  { code: '+377', country: 'MC', flag: '🇲🇨', name: 'Monaco' },
  { code: '+378', country: 'SM', flag: '🇸🇲', name: 'San Marino' },
  { code: '+380', country: 'UA', flag: '🇺🇦', name: 'Ukraine' },
  { code: '+381', country: 'RS', flag: '🇷🇸', name: 'Serbia' },
  { code: '+382', country: 'ME', flag: '🇲🇪', name: 'Montenegro' },
  { code: '+383', country: 'XK', flag: '🇽🇰', name: 'Kosovo' },
  { code: '+385', country: 'HR', flag: '🇭🇷', name: 'Croatia' },
  { code: '+386', country: 'SI', flag: '🇸🇮', name: 'Slovenia' },
  { code: '+387', country: 'BA', flag: '🇧🇦', name: 'Bosnia and Herzegovina' },
  { code: '+389', country: 'MK', flag: '🇲🇰', name: 'North Macedonia' },
  { code: '+420', country: 'CZ', flag: '🇨🇿', name: 'Czech Republic' },
  { code: '+421', country: 'SK', flag: '🇸🇰', name: 'Slovakia' },
  { code: '+423', country: 'LI', flag: '🇱🇮', name: 'Liechtenstein' },
  { code: '+500', country: 'FK', flag: '🇫🇰', name: 'Falkland Islands' },
  { code: '+501', country: 'BZ', flag: '🇧🇿', name: 'Belize' },
  { code: '+502', country: 'GT', flag: '🇬🇹', name: 'Guatemala' },
  { code: '+503', country: 'SV', flag: '🇸🇻', name: 'El Salvador' },
  { code: '+504', country: 'HN', flag: '🇭🇳', name: 'Honduras' },
  { code: '+505', country: 'NI', flag: '🇳🇮', name: 'Nicaragua' },
  { code: '+506', country: 'CR', flag: '🇨🇷', name: 'Costa Rica' },
  { code: '+507', country: 'PA', flag: '🇵🇦', name: 'Panama' },
  { code: '+508', country: 'PM', flag: '🇵🇲', name: 'Saint Pierre and Miquelon' },
  { code: '+509', country: 'HT', flag: '🇭🇹', name: 'Haiti' },
  { code: '+590', country: 'GP', flag: '🇬🇵', name: 'Guadeloupe' },
  { code: '+591', country: 'BO', flag: '🇧🇴', name: 'Bolivia' },
  { code: '+592', country: 'GY', flag: '🇬🇾', name: 'Guyana' },
  { code: '+593', country: 'EC', flag: '🇪🇨', name: 'Ecuador' },
  { code: '+594', country: 'GF', flag: '🇬🇫', name: 'French Guiana' },
  { code: '+595', country: 'PY', flag: '🇵🇾', name: 'Paraguay' },
  { code: '+596', country: 'MQ', flag: '🇲🇶', name: 'Martinique' },
  { code: '+597', country: 'SR', flag: '🇸🇷', name: 'Suriname' },
  { code: '+598', country: 'UY', flag: '🇺🇾', name: 'Uruguay' },
  { code: '+599', country: 'CW', flag: '🇨🇼', name: 'Curaçao' },
  { code: '+670', country: 'TL', flag: '🇹🇱', name: 'Timor-Leste' },
  { code: '+672', country: 'NF', flag: '🇳🇫', name: 'Norfolk Island' },
  { code: '+673', country: 'BN', flag: '🇧🇳', name: 'Brunei' },
  { code: '+674', country: 'NR', flag: '🇳🇷', name: 'Nauru' },
  { code: '+675', country: 'PG', flag: '🇵🇬', name: 'Papua New Guinea' },
  { code: '+676', country: 'TO', flag: '🇹🇴', name: 'Tonga' },
  { code: '+677', country: 'SB', flag: '🇸🇧', name: 'Solomon Islands' },
  { code: '+678', country: 'VU', flag: '🇻🇺', name: 'Vanuatu' },
  { code: '+679', country: 'FJ', flag: '🇫🇯', name: 'Fiji' },
  { code: '+680', country: 'PW', flag: '🇵🇼', name: 'Palau' },
  { code: '+681', country: 'WF', flag: '🇼🇫', name: 'Wallis and Futuna' },
  { code: '+682', country: 'CK', flag: '🇨🇰', name: 'Cook Islands' },
  { code: '+683', country: 'NU', flag: '🇳🇺', name: 'Niue' },
  { code: '+685', country: 'WS', flag: '🇼🇸', name: 'Samoa' },
  { code: '+686', country: 'KI', flag: '🇰🇮', name: 'Kiribati' },
  { code: '+687', country: 'NC', flag: '🇳🇨', name: 'New Caledonia' },
  { code: '+688', country: 'TV', flag: '🇹🇻', name: 'Tuvalu' },
  { code: '+689', country: 'PF', flag: '🇵🇫', name: 'French Polynesia' },
  { code: '+690', country: 'TK', flag: '🇹🇰', name: 'Tokelau' },
  { code: '+691', country: 'FM', flag: '🇫🇲', name: 'Micronesia' },
  { code: '+692', country: 'MH', flag: '🇲🇭', name: 'Marshall Islands' },
  { code: '+850', country: 'KP', flag: '🇰🇵', name: 'North Korea' },
  { code: '+852', country: 'HK', flag: '🇭🇰', name: 'Hong Kong' },
  { code: '+853', country: 'MO', flag: '🇲🇴', name: 'Macau' },
  { code: '+855', country: 'KH', flag: '🇰🇭', name: 'Cambodia' },
  { code: '+856', country: 'LA', flag: '🇱🇦', name: 'Laos' },
  { code: '+880', country: 'BD', flag: '🇧🇩', name: 'Bangladesh' },
  { code: '+886', country: 'TW', flag: '🇹🇼', name: 'Taiwan' },
  { code: '+960', country: 'MV', flag: '🇲🇻', name: 'Maldives' },
  { code: '+961', country: 'LB', flag: '🇱🇧', name: 'Lebanon' },
  { code: '+962', country: 'JO', flag: '🇯🇴', name: 'Jordan' },
  { code: '+963', country: 'SY', flag: '🇸🇾', name: 'Syria' },
  { code: '+964', country: 'IQ', flag: '🇮🇶', name: 'Iraq' },
  { code: '+965', country: 'KW', flag: '🇰🇼', name: 'Kuwait' },
  { code: '+966', country: 'SA', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: '+967', country: 'YE', flag: '🇾🇪', name: 'Yemen' },
  { code: '+968', country: 'OM', flag: '🇴🇲', name: 'Oman' },
  { code: '+970', country: 'PS', flag: '🇵🇸', name: 'Palestine' },
  { code: '+971', country: 'AE', flag: '🇦🇪', name: 'United Arab Emirates' },
  { code: '+972', country: 'IL', flag: '🇮🇱', name: 'Israel' },
  { code: '+973', country: 'BH', flag: '🇧🇭', name: 'Bahrain' },
  { code: '+974', country: 'QA', flag: '🇶🇦', name: 'Qatar' },
  { code: '+975', country: 'BT', flag: '🇧🇹', name: 'Bhutan' },
  { code: '+976', country: 'MN', flag: '🇲🇳', name: 'Mongolia' },
  { code: '+977', country: 'NP', flag: '🇳🇵', name: 'Nepal' },
  { code: '+992', country: 'TJ', flag: '🇹🇯', name: 'Tajikistan' },
  { code: '+993', country: 'TM', flag: '🇹🇲', name: 'Turkmenistan' },
  { code: '+994', country: 'AZ', flag: '🇦🇿', name: 'Azerbaijan' },
  { code: '+995', country: 'GE', flag: '🇬🇪', name: 'Georgia' },
  { code: '+996', country: 'KG', flag: '🇰🇬', name: 'Kyrgyzstan' },
  { code: '+998', country: 'UZ', flag: '🇺🇿', name: 'Uzbekistan' },
];

// Countries list (comprehensive, sorted alphabetically)
const COUNTRIES = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Argentina',
  'Armenia',
  'Aruba',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahrain',
  'Bangladesh',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brazil',
  'British Indian Ocean Territory',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Cape Verde',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Cook Islands',
  'Costa Rica',
  'Croatia',
  'Cuba',
  'Curaçao',
  'Cyprus',
  'Czech Republic',
  'Democratic Republic of the Congo',
  'Denmark',
  'Djibouti',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Eswatini',
  'Ethiopia',
  'Falkland Islands',
  'Faroe Islands',
  'Fiji',
  'Finland',
  'France',
  'French Guiana',
  'French Polynesia',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Gibraltar',
  'Greece',
  'Greenland',
  'Guadeloupe',
  'Guatemala',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hong Kong',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Ivory Coast',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kenya',
  'Kiribati',
  'Kosovo',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Macau',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Martinique',
  'Mauritius',
  'Mexico',
  'Micronesia',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'New Caledonia',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'Niue',
  'Norfolk Island',
  'North Korea',
  'North Macedonia',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Palestine',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Republic of the Congo',
  'Réunion',
  'Romania',
  'Russia',
  'Rwanda',
  'Saint Helena',
  'Saint Pierre and Miquelon',
  'Samoa',
  'San Marino',
  'São Tomé and Príncipe',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Korea',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Timor-Leste',
  'Togo',
  'Tokelau',
  'Tonga',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Venezuela',
  'Vietnam',
  'Wallis and Futuna',
  'Yemen',
  'Zambia',
  'Zimbabwe',
];

// Industries list (50 service-based industries)
const INDUSTRIES = [
  'Hair Salon & Barbershop',
  'Beauty Salon & Spa',
  'Nail Salon',
  'Massage Therapy',
  'Yoga & Pilates Studio',
  'Fitness & Gym',
  'Personal Training',
  'Physical Therapy',
  'Chiropractic',
  'Dental Practice',
  'Medical Practice',
  'Veterinary Clinic',
  'Pet Grooming',
  'Tattoo & Piercing',
  'Photography Studio',
  'Music Lessons',
  'Dance Studio',
  'Martial Arts',
  'Tennis & Racquet Sports',
  'Golf Lessons & Coaching',
  'Swimming Lessons',
  'Tutoring & Education',
  'Language School',
  'Cooking Classes',
  'Art Classes',
  'Counseling & Therapy',
  'Life Coaching',
  'Consulting Services',
  'Legal Services',
  'Accounting & Bookkeeping',
  'Financial Planning',
  'Real Estate',
  'Interior Design',
  'Home Cleaning',
  'Lawn Care & Landscaping',
  'Auto Repair & Detailing',
  'Bike Repair',
  'Computer Repair',
  'Phone Repair',
  'Escape Rooms',
  'Event Planning',
  'Catering',
  'Wedding Services',
  'Entertainment & Performers',
  'Tour & Travel Services',
  'Equipment Rental',
  'Co-working Space',
  'Meeting Rooms',
  'Storage Facilities',
  'Car Wash',
];

// Team sizes
const TEAM_SIZES = [
  'Just me',
  '2-5 employees',
  '6-10 employees',
  '11-25 employees',
  '26-50 employees',
  '51-100 employees',
  '100+ employees',
];

// Booking software options
const BOOKING_SOFTWARE = [
  'Acuity',
  'Booksy',
  'Calendly',
  'Fresha',
  'Goldie',
  'Janeapp',
  'Mindbody',
  'Salon Iris',
  'Setmore',
  'Shortcuts',
  'Square',
  'Styleseat',
  'Timely',
  'Treatwell',
  'Vagaro',
  'Zenoti',
  "I'm not using any software",
  'Other',
];

// Referral sources
const REFERRAL_SOURCES = [
  'Recommended by a friend',
  'Search engine (e.g. Google, Bing)',
  'Social media',
  'Ratings website (e.g. Capterra, Trustpilot)',
  'AI Chatbot',
  'Other',
];

// Validation schema
const signupSchema = z.object({
  // Step 1
  firstName: z
    .string()
    .min(1, { message: 'First name is required' })
    .min(2, { message: 'First name must be at least 2 characters' })
    .max(50, { message: 'First name must be less than 50 characters' }),
  lastName: z
    .string()
    .min(1, { message: 'Last name is required' })
    .min(2, { message: 'Last name must be at least 2 characters' })
    .max(50, { message: 'Last name must be less than 50 characters' }),
  countryCode: z.string().min(1, { message: 'Country code is required' }),
  phoneNumber: z
    .string()
    .min(1, { message: 'Phone number is required' })
    .min(6, { message: 'Please enter a valid phone number' })
    .max(20, { message: 'Phone number is too long' }),
  country: z.string().min(1, { message: 'Country is required' }),
  
  // Step 2
  businessName: z
    .string()
    .min(1, { message: 'Business name is required' })
    .min(2, { message: 'Business name must be at least 2 characters' })
    .max(100, { message: 'Business name must be less than 100 characters' }),
  website: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      try {
        new URL(val.startsWith('http') ? val : `https://${val}`);
        return true;
      } catch {
        return false;
      }
    }, { message: 'Please enter a valid URL' }),
  physicalAddress: z.string().optional(),
  teamSize: z.string().min(1, { message: 'Please select your team size' }),
  
  // Step 3
  industries: z
    .array(z.string())
    .min(1, { message: 'Please select at least one industry' }),
  primaryIndustry: z.string().min(1, { message: 'Please select a primary industry' }),
  customIndustry: z.string().optional(),
  
  // Step 4
  serviceLocations: z
    .array(z.string())
    .min(1, { message: 'Please select at least one service location' }),
  
  // Step 5
  currentSoftware: z.string().min(1, { message: 'Please select an option' }),
  
  // Step 6
  referralSource: z.string().min(1, { message: 'Please select how you heard about us' }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [industrySearch, setIndustrySearch] = useState('');
  const [showOtherIndustry, setShowOtherIndustry] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const totalSteps = 6;

  // Check for pending signup on mount
  useEffect(() => {
    const checkPendingSignup = async () => {
      try {
        const response = await fetch('/api/auth/check-pending-signup');
        const data = await response.json();
        
        if (!response.ok || !data.email) {
          // No pending signup, redirect to create account
          router.push('/create-account');
          return;
        }
        
        setVerifiedEmail(data.email);
        setIsLoading(false);
      } catch (err) {
        console.error('Error checking pending signup:', err);
        router.push('/create-account');
      }
    };

    checkPendingSignup();
  }, [router]);

  const stepNames = [
    'Personal Info',
    'Business Details',
    'Industry',
    'Service Locations',
    'Current Software',
    'Almost Done!',
  ];

  const stepIcons = [
    User,
    Building2,
    Briefcase,
    MapPin,
    Laptop,
    MessageSquare,
  ];

  const progress = (currentStep / totalSteps) * 100;

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onTouched',
    defaultValues: {
      firstName: '',
      lastName: '',
      countryCode: 'US',
      phoneNumber: '',
      country: '',
      businessName: '',
      website: '',
      physicalAddress: '',
      teamSize: '',
      industries: [],
      primaryIndustry: '',
      customIndustry: '',
      serviceLocations: [],
      currentSoftware: '',
      referralSource: '',
    },
  });

  // Watch form values
  const industries = form.watch('industries');
  const primaryIndustry = form.watch('primaryIndustry');
  const serviceLocations = form.watch('serviceLocations');
  const selectedCountryCodeIdentifier = form.watch('countryCode');
  const selectedCountry = form.watch('country');

  // Get the actual phone code from the country identifier
  const getPhoneCodeFromIdentifier = (identifier: string) => {
    const country = COUNTRY_CODES.find(c => c.country === identifier);
    return country?.code || '+1';
  };

  const selectedCountryCode = getPhoneCodeFromIdentifier(selectedCountryCodeIdentifier);

  // Get available countries based on country code
  const getAvailableCountries = (code: string) => {
    // For +1 (US/Canada), show only US by default, or Canada if already selected
    if (code === '+1') {
      if (selectedCountry === 'Canada') {
        return ['United States', 'Canada'];
      }
      return ['United States', 'Canada'];
    }
    // For all other codes, show all countries
    return COUNTRIES;
  };

  // Auto-select country when country code changes
  const handleCountryCodeChange = (countryIdentifier: string) => {
    form.setValue('countryCode', countryIdentifier);
    
    const country = COUNTRY_CODES.find(c => c.country === countryIdentifier);
    const code = country?.code;
    
    // Auto-select country based on code for +1
    if (code === '+1' && selectedCountry !== 'Canada') {
      form.setValue('country', 'United States');
    }
  };

  // Get phone placeholder based on country code
  const getPhonePlaceholder = (code: string) => {
    const formats: { [key: string]: string } = {
      '+1': '(555) 123-4567',
      '+7': '495 123-45-67',
      '+20': '2 1234 5678',
      '+27': '21 123 4567',
      '+30': '21 1234 5678',
      '+31': '20 123 4567',
      '+32': '2 123 45 67',
      '+33': '1 23 45 67 89',
      '+34': '912 34 56 78',
      '+36': '1 234 5678',
      '+39': '02 1234 5678',
      '+40': '21 123 4567',
      '+41': '21 234 56 78',
      '+43': '1 234 5678',
      '+44': '20 1234 5678',
      '+45': '12 34 56 78',
      '+46': '8 123 456 78',
      '+47': '21 23 45 67',
      '+48': '12 345 67 89',
      '+49': '30 12345678',
      '+51': '1 234 5678',
      '+52': '55 1234 5678',
      '+53': '7 1234567',
      '+54': '11 1234-5678',
      '+55': '11 91234-5678',
      '+56': '2 2123 4567',
      '+57': '1 234 5678',
      '+58': '212 123 4567',
      '+60': '3 1234 5678',
      '+61': '2 1234 5678',
      '+62': '21 1234 5678',
      '+63': '2 1234 5678',
      '+64': '9 123 4567',
      '+65': '6123 4567',
      '+66': '2 123 4567',
      '+81': '3 1234 5678',
      '+82': '2 1234 5678',
      '+84': '24 1234 5678',
      '+86': '10 1234 5678',
      '+90': '212 123 4567',
      '+91': '22 1234 5678',
      '+92': '21 1234 5678',
      '+93': '20 123 4567',
      '+94': '11 234 5678',
      '+95': '1 234 567',
      '+98': '21 1234 5678',
      '+212': '5 1234 5678',
      '+213': '21 12 34 56',
      '+216': '71 123 456',
      '+218': '21 123 4567',
      '+220': '123 4567',
      '+221': '33 123 45 67',
      '+223': '20 12 34 56',
      '+224': '30 123 456',
      '+225': '21 12 34 56',
      '+226': '25 12 34 56',
      '+227': '20 12 34 56',
      '+228': '22 12 34 56',
      '+229': '21 12 34 56',
      '+230': '210 1234',
      '+231': '21 123 456',
      '+232': '22 123456',
      '+233': '30 123 4567',
      '+234': '1 234 5678',
      '+235': '22 12 34 56',
      '+236': '21 12 34 56',
      '+237': '2 22 12 34 56',
      '+238': '221 12 34',
      '+239': '222 1234',
      '+240': '333 123 456',
      '+241': '1 12 34 56',
      '+242': '222 123 456',
      '+243': '12 345 6789',
      '+244': '222 123 456',
      '+245': '955 1234',
      '+246': '380 1234',
      '+248': '4 123 456',
      '+249': '121 234 567',
      '+250': '250 123 456',
      '+251': '11 123 4567',
      '+252': '1 234 567',
      '+253': '21 12 34 56',
      '+254': '20 1234567',
      '+255': '22 123 4567',
      '+256': '31 1234567',
      '+257': '22 12 34 56',
      '+258': '21 123 456',
      '+260': '211 123456',
      '+261': '20 12 345 67',
      '+262': '262 12 34 56',
      '+263': '1 234 5678',
      '+264': '61 123 4567',
      '+265': '1 234 567',
      '+266': '2212 3456',
      '+267': '71 123 456',
      '+268': '2212 3456',
      '+269': '321 23 45',
      '+290': '1234',
      '+291': '1 123 456',
      '+297': '123 4567',
      '+298': '123456',
      '+299': '12 34 56',
      '+350': '12345678',
      '+351': '21 123 4567',
      '+352': '621 123 456',
      '+353': '1 234 5678',
      '+354': '123 4567',
      '+355': '4 123 4567',
      '+356': '2123 4567',
      '+357': '22 123456',
      '+358': '50 123 4567',
      '+359': '2 123 4567',
      '+370': '5 123 4567',
      '+371': '2123 4567',
      '+372': '5123 4567',
      '+373': '22 123 456',
      '+374': '10 123456',
      '+375': '17 123 45 67',
      '+376': '312 345',
      '+377': '93 12 34 56',
      '+378': '0549 123456',
      '+380': '44 123 4567',
      '+381': '11 123 4567',
      '+382': '20 123 456',
      '+383': '43 123 456',
      '+385': '1 234 5678',
      '+386': '1 234 56 78',
      '+387': '33 123 456',
      '+389': '2 123 4567',
      '+420': '123 456 789',
      '+421': '2 1234 5678',
      '+423': '123 4567',
      '+500': '12345',
      '+501': '123 4567',
      '+502': '2123 4567',
      '+503': '2123 4567',
      '+504': '2123 4567',
      '+505': '2123 4567',
      '+506': '2123 4567',
      '+507': '212 3456',
      '+508': '12 34 56',
      '+509': '22 12 3456',
      '+590': '690 12 34 56',
      '+591': '2 123 4567',
      '+592': '123 4567',
      '+593': '2 123 4567',
      '+594': '694 12 34 56',
      '+595': '21 123 456',
      '+596': '696 12 34 56',
      '+597': '123 4567',
      '+598': '2 123 4567',
      '+599': '9 123 4567',
      '+670': '3123 4567',
      '+672': '3 1234',
      '+673': '2 123456',
      '+674': '555 1234',
      '+675': '7123 4567',
      '+676': '12345',
      '+677': '12345',
      '+678': '12345',
      '+679': '123 4567',
      '+680': '123 4567',
      '+681': '12 34 56',
      '+682': '12 345',
      '+683': '1234',
      '+685': '12345',
      '+686': '12345',
      '+687': '12 34 56',
      '+688': '12345',
      '+689': '12 34 56',
      '+690': '1234',
      '+691': '123 4567',
      '+692': '123 4567',
      '+850': '2 123 4567',
      '+852': '1234 5678',
      '+853': '1234 5678',
      '+855': '12 123 456',
      '+856': '21 123 456',
      '+880': '2 1234 5678',
      '+886': '2 1234 5678',
      '+960': '123 4567',
      '+961': '1 123 456',
      '+962': '6 123 4567',
      '+963': '11 1234 567',
      '+964': '1 234 5678',
      '+965': '1234 5678',
      '+966': '11 123 4567',
      '+967': '1 234 567',
      '+968': '2123 4567',
      '+970': '2 234 5678',
      '+971': '2 123 4567',
      '+972': '2 123 4567',
      '+973': '1234 5678',
      '+974': '1234 5678',
      '+975': '2 123 456',
      '+976': '11 12 3456',
      '+977': '1 234567',
      '+992': '37 123 4567',
      '+993': '12 123456',
      '+994': '12 123 45 67',
      '+995': '32 123 45 67',
      '+996': '312 123 456',
      '+998': '71 123 45 67',
    };
    return formats[code] || '123 456 7890';
  };

  // Filter industries based on search
  const filteredIndustries = INDUSTRIES.filter((industry) =>
    industry.toLowerCase().includes(industrySearch.toLowerCase())
  );

  // Handle industry selection
  const handleIndustrySelect = (industry: string) => {
    const currentIndustries = industries || [];
    if (!currentIndustries.includes(industry)) {
      const newIndustries = [...currentIndustries, industry];
      form.setValue('industries', newIndustries, { shouldValidate: true });
      
      // Set as primary if it's the first one
      if (newIndustries.length === 1) {
        form.setValue('primaryIndustry', industry, { shouldValidate: true });
      }
    }
    setIndustrySearch('');
  };

  // Handle industry removal
  const handleIndustryRemove = (industry: string) => {
    const currentIndustries = industries || [];
    const newIndustries = currentIndustries.filter((i) => i !== industry);
    form.setValue('industries', newIndustries, { shouldValidate: true });
    
    // Update primary if needed
    if (primaryIndustry === industry && newIndustries.length > 0) {
      form.setValue('primaryIndustry', newIndustries[0], { shouldValidate: true });
    } else if (newIndustries.length === 0) {
      form.setValue('primaryIndustry', '', { shouldValidate: true });
    }
  };

  // Handle primary industry selection
  const handlePrimarySelect = (industry: string) => {
    form.setValue('primaryIndustry', industry, { shouldValidate: true });
  };

  // Handle service location toggle
  const handleServiceLocationToggle = (location: string) => {
    const currentLocations = serviceLocations || [];
    if (currentLocations.includes(location)) {
      form.setValue(
        'serviceLocations',
        currentLocations.filter((l) => l !== location),
        { shouldValidate: true }
      );
    } else {
      form.setValue('serviceLocations', [...currentLocations, location], { shouldValidate: true });
    }
  };

  // Validate current step
  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof SignupFormValues)[] = [];
    
    switch (step) {
      case 1:
        fieldsToValidate = ['firstName', 'lastName', 'countryCode', 'phoneNumber', 'country'];
        break;
      case 2:
        fieldsToValidate = ['businessName', 'teamSize'];
        break;
      case 3:
        fieldsToValidate = ['industries', 'primaryIndustry'];
        break;
      case 4:
        fieldsToValidate = ['serviceLocations'];
        break;
      case 5:
        fieldsToValidate = ['currentSoftware'];
        break;
      case 6:
        fieldsToValidate = ['referralSource'];
        break;
    }
    
    const result = await form.trigger(fieldsToValidate);
    return result;
  };

  // Handle next step
  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Handle form submission
  const handleSubmit = async (data: SignupFormValues) => {
    setError('');

    if (!verifiedEmail) {
      setError('Email verification expired. Please start over.');
      router.push('/create-account');
      return;
    }

    try {
      const response = await fetch('/api/auth/complete-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Signup failed');
      }

      // Redirect to dashboard
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // Show loading state while checking for pending signup
  if (isLoading) {
    return (
      <BubbleBackground className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </BubbleBackground>
    );
  }

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            {/* Step header with explanation */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Let's start with your details
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                We'll use this information to set up your account and keep you updated on your bookings.
              </p>
            </div>

            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="John"
                      autoComplete="given-name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Doe"
                      autoComplete="family-name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="countryCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        handleCountryCodeChange(value);
                      }} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue>
                            {(() => {
                              const country = COUNTRY_CODES.find(c => c.country === field.value);
                              return country ? (
                                <span className="flex items-center gap-2">
                                  <span>{country.flag}</span>
                                  <span>{country.code}</span>
                                </span>
                              ) : 'Select code';
                            })()}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {COUNTRY_CODES.map((item, index) => (
                          <SelectItem key={`${item.code}-${item.country}-${index}`} value={item.country}>
                            <span className="flex items-center gap-2">
                              <span>{item.flag}</span>
                              <span>{item.code}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Phone number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder={getPhonePlaceholder(selectedCountryCode)}
                        autoComplete="tel"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getAvailableCountries(selectedCountryCode).map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            {/* Step header with explanation */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Tell us about your business
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Help us understand your business better so we can tailor the platform to match your needs and brand.
              </p>
            </div>

            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Acme Salon"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="www.example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Your business website</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="physicalAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Physical address (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="123 Main St, City, State, ZIP"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Your business location</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="teamSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team size</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your team size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TEAM_SIZES.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            {/* Step header with explanation */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                What industry do you serve?
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                This helps us customize your booking experience with industry-specific features, 
                templates, and workflows tailored to your business needs.
              </p>
            </div>

            <div>
              <FormLabel>Search for your industry</FormLabel>
              <div className="mt-2">
                <Input
                  type="text"
                  placeholder="Search industries..."
                  value={industrySearch}
                  onChange={(e) => setIndustrySearch(e.target.value)}
                />
              </div>

              {/* Search results */}
              {industrySearch && (
                <div className="mt-2 max-h-48 overflow-y-auto rounded-md border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                  {filteredIndustries.length > 0 ? (
                    <div className="p-1">
                      {filteredIndustries.map((industry) => (
                        <button
                          key={industry}
                          type="button"
                          onClick={() => handleIndustrySelect(industry)}
                          disabled={industries?.includes(industry)}
                          className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-800"
                        >
                          {industry}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4">
                      <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                        No industries found
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setShowOtherIndustry(true);
                          setIndustrySearch('');
                        }}
                        className="text-sm font-semibold text-primary hover:text-primary/80"
                      >
                        Add custom industry
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Custom industry input */}
              {showOtherIndustry && (
                <div className="mt-2">
                  <FormField
                    control={form.control}
                    name="customIndustry"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input
                              type="text"
                              placeholder="Enter your industry"
                              {...field}
                            />
                            <Button
                              type="button"
                              onClick={() => {
                                if (field.value) {
                                  handleIndustrySelect(field.value);
                                  field.onChange('');
                                  setShowOtherIndustry(false);
                                }
                              }}
                            >
                              Add
                            </Button>
                          </div>
                            </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {!showOtherIndustry && !industrySearch && (
                <button
                  type="button"
                  onClick={() => setShowOtherIndustry(true)}
                  className="mt-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  Can't find your industry? Add custom
                </button>
              )}
            </div>

            {/* Selected industries */}
            {industries && industries.length > 0 && (
              <FormField
                control={form.control}
                name="industries"
                render={() => (
                  <FormItem>
                    <FormLabel>Selected industries</FormLabel>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {industries.map((industry) => (
                        <Badge
                          key={industry}
                          variant={primaryIndustry === industry ? 'default' : 'secondary'}
                          className="cursor-pointer gap-1 pr-1"
                          onClick={() => handlePrimarySelect(industry)}
                        >
                          {industry}
                          {primaryIndustry === industry && (
                            <span className="text-xs">(Primary)</span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleIndustryRemove(industry);
                            }}
                            className="ml-1 rounded-full hover:bg-black/20"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <FormDescription>
                      Click on a badge to set it as your primary industry
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
                  </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            {/* Step header with explanation */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Where do you serve your clients?
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                This helps us configure the right booking options and scheduling features for how you deliver your services.
              </p>
            </div>

            <FormField
              control={form.control}
              name="serviceLocations"
              render={() => (
                <FormItem>
                  <FormDescription className="mb-4">
                    Select all that apply
                  </FormDescription>
                  <div className="space-y-3">
                    {[
                      { value: 'in-store', label: 'In store / Physical location' },
                      { value: 'online', label: 'Online' },
                      { value: 'client-location', label: "At client's location" },
                    ].map((location) => (
                      <div
                        key={location.value}
                        className="flex items-center space-x-3"
                      >
                        <Checkbox
                          checked={serviceLocations?.includes(location.value)}
                          onCheckedChange={() => handleServiceLocationToggle(location.value)}
                        />
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {location.label}
                        </label>
                </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            {/* Step header with explanation */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                What are you currently using?
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Let us know your current booking solution so we can make your transition smooth and help you import your data if needed.
              </p>
            </div>

            <FormField
              control={form.control}
              name="currentSoftware"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current booking software</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="space-y-2"
                    >
                      {BOOKING_SOFTWARE.map((software) => (
                        <div key={software} className="flex items-center space-x-3">
                          <RadioGroupItem value={software} id={software} />
                          <label
                            htmlFor={software}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {software}
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            {/* Step header with explanation */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Almost there!
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Just one final detail and you'll be ready to start managing your bookings more efficiently.
              </p>
            </div>

            <FormField
              control={form.control}
              name="referralSource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How did you hear about us?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="space-y-2"
                    >
                      {REFERRAL_SOURCES.map((source) => (
                        <div key={source} className="flex items-center space-x-3">
                          <RadioGroupItem value={source} id={source} />
                          <label
                            htmlFor={source}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {source}
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <p className="text-xs text-gray-600 dark:text-gray-400">
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <BubbleBackground className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Top Left Logo - Always visible */}
      <div className="absolute left-6 top-6 z-10 sm:left-8 sm:top-8">
        <Logo size="xsm" showText href="/" />
      </div>

      {/* Theme Toggle */}
      <div className="absolute right-6 top-6 z-10 sm:right-8 sm:top-8">
        <ThemeToggle size="sm" />
      </div>

      <div className="relative z-10 w-full px-4 py-12 pt-24 sm:pt-28 md:pt-16">
        {/* Main Content Container */}
        <div className="mx-auto max-w-4xl">
          <div className="space-y-8">
            {/* Header - Centered on all screen sizes */}
            <div className="flex flex-col items-center space-y-4">
              <div className="text-center">
                <h1 className="text-display-xs font-semibold text-gray-900 dark:text-white">
                  Create your account
                </h1>
                <p className="mt-3 text-md text-gray-600 dark:text-gray-400">
                  Start managing your bookings in minutes
                </p>
              </div>
            </div>

            {/* Connected Sidebar + Form Card */}
            <div className="flex flex-row overflow-hidden rounded-lg border border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm dark:border-gray-800 dark:bg-gray-900/95">
              {/* Left Sidebar - Progress Steps */}
              {/* Always visible, full width on md+, icon-only on small screens */}
              <div className="w-16 border-r border-gray-200 bg-gray-50/50 p-3 dark:border-gray-800 dark:bg-gray-900/50 md:w-[30%] md:p-6">
                <div className="space-y-6">
                  {/* Step indicators */}
                  <div className="space-y-1 md:space-y-2">
                    {stepNames.map((name, index) => {
                      const stepNumber = index + 1;
                      const StepIcon = stepIcons[index];
                      const isCompleted = stepNumber < currentStep;
                      const isCurrent = stepNumber === currentStep;
                      
                      return (
                        <div
                          key={stepNumber}
                          className={`flex items-center gap-3 rounded-lg p-2 transition-colors md:p-3 ${
                            isCurrent
                              ? 'bg-primary/10 text-primary dark:bg-primary/20'
                              : isCompleted
                              ? 'text-primary/70 dark:text-primary/60'
                              : 'text-gray-400 dark:text-gray-600'
                          }`}
                        >
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                              isCurrent
                                ? 'bg-primary text-primary-foreground'
                                : isCompleted
                                ? 'bg-primary/20 text-primary dark:bg-primary/30'
                                : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-500'
                            }`}
                          >
                            {isCompleted ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <StepIcon className="h-4 w-4" />
                            )}
                          </div>
                          {/* Text content - only visible on md+ screens */}
                          <div className="hidden flex-1 min-w-0 md:block">
                            <p className={`text-sm font-medium truncate ${isCurrent ? 'font-semibold' : ''}`}>
                              {name}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              </div>

              {/* Right Content Area - Form */}
              <div className="flex-1 p-6 md:p-8">
                {/* Form wrapper with max-width */}
                <div className="mx-auto max-w-xl">
                  {/* Form content */}
                  <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
                    <div key={currentStep}>
                      {renderStepContent()}
                    </div>

                    {error && (
                      <div className="mt-4 rounded-lg bg-error-50 p-3 text-sm text-error-600 dark:bg-error-900/20 dark:text-error-400">
                        {error}
                      </div>
                    )}

                    {/* Navigation buttons */}
                    <div className="mt-6 flex items-center justify-between gap-4">
                      {currentStep > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handlePrevious}
                          className="flex items-center gap-2"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                      )}
                      
                      {currentStep < totalSteps ? (
                        <Button
                          type="button"
                          onClick={handleNext}
                          className={`flex items-center gap-2 ${currentStep === 1 ? 'w-full' : 'ml-auto'}`}
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          className="ml-auto"
                          disabled={form.formState.isSubmitting}
                        >
                          {form.formState.isSubmitting ? 'Creating account...' : 'Create account'}
                        </Button>
                      )}
                    </div>

                  </form>
                </Form>

                {/* Links section */}
                <div className="mt-6 border-t border-gray-200 pt-6 text-center dark:border-gray-800">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Already part of a team?{' '}
                    <Link
                      href="/accept-invite"
                      className="font-semibold text-primary hover:text-primary/80"
                    >
                      Join your team
                    </Link>
                  </p>
                  <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-primary hover:text-primary/80">
                      Sign in
                    </Link>
                  </p>
                </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8">
              <AuthFooter variant="light" />
            </div>
          </div>
        </div>
      </div>
    </BubbleBackground>
  );
}
