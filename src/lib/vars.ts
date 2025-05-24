/** 변경시 supabase에도 적용해줘야함 */
export const candidatesEnum = ["이재명", "김문수", "이준석"] as const;
/** 변경시 supabase에도 적용해줘야함 */
export const regionsEnum = [
  "서울",
  "부산",
  "대구",
  "인천",
  "광주",
  "대전",
  "울산",
  "세종",
  "경기",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주"
] as const;
/** 변경시 supabase에도 적용해줘야함 */
export const genderEnum = [
  "male",
  "female"
] as const;
/** 변경시 supabase에도 적용해줘야함 */
export const ageGroupsEnum = [
  "-18",
  "18-29",
  "30-39",
  "40-49",
  "50-59",
  "60-69",
  "70-",
] as const;


export type VoteCandidate = (typeof candidatesEnum)[number];
export type VoteRegion = (typeof regionsEnum)[number];
export type VoteGender = (typeof genderEnum)[number];
export type VoteAgeGroup = (typeof ageGroupsEnum)[number];

export const priorityQuestions = [
  "경제 회복과 물가 안정",
  "공정하고 정의로운 사회",
  "과학기술 발전",
  "국민과의 적극적인 소통",
  "외교·안보 리더십",
  "기타",
];

export const candidateColorMap: Record<VoteCandidate, string> = {
  "이재명": "#152484",
  "김문수": "#E61E2B",
  "이준석": "#FF7210"
};

export const genderToKo: Record<VoteGender, string> = {
  male: "남",
  female: "여"
}