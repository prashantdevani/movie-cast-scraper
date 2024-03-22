import puppeteer from 'puppeteer';

// http://localhost:3000/api/getProfileDataById?id=teko

async function getProfileDataById(id: string) {
    const browser = await puppeteer.launch({
        headless: 'new'
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0')
    await page.goto(`https://clutch.co/profile/${encodeURIComponent(id)}`);
    const companyName = await page.$eval(".profile-header .profile-header__title .website-link__item", (element => {
        return element.innerHTML.trim();
    }))

    const companyLogoUrl = await page.$eval(".profile-header img", (element => {
        return element.getAttribute("src");
    }))

    const companyDescription = await page.$eval("#profile-summary-text p", (element => {
        return element?.textContent?.trim();
    }))

    await browser.close();
    return JSON.stringify({ companyName, companyLogoUrl, companyDescription });
}

export async function GET(request: Request) {
    const queryParam = new URLSearchParams(new URL(request.url).search);
    const id = queryParam.get("id") ?? "teko";
    const pageItemList = await getProfileDataById(id)
    return new Response(pageItemList, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
}