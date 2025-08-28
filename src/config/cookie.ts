const cookieOptions: any = {
    httpOnly: true,
    secure: process.env.APP_ENV === 'production',
    sameSite: 'lax',
    path: '/',
};

if (process.env.APP_ENV === 'production' && process.env.APP_DOMAIN) {
    cookieOptions.domain = process.env.APP_DOMAIN;
}

export default cookieOptions;