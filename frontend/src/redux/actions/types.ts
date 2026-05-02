export type UserLoginData = {
    email: string;
    password: string;
}

export type UserRegisterData = {
    name: string;
    email: string;
    password: string;
}

export  type UserResponse ={
    user_id: string;
    name: string;
    email: string;
    profile_info: Record<string, any>;
    created_at: string;
}


export interface  jobData {
    companyName: string;
    jobDescription: string;
    position: string;
    keywords: string[];
    resumeStyle: 'ATS' | 'Modern' | 'Minimal' | 'Professional';
    useDemoContent: boolean;
}