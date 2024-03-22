import puppeteer from 'puppeteer';

// http://localhost:3000/api/getListByMenuName?path=/developers&page=5

async function getListDataByPath(path: string, pageNumber: string) {
    const browser = await puppeteer.launch({
        headless: 'new'
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0')
    await page.goto(`https://clutch.co/${encodeURIComponent(path)}?page=${encodeURIComponent(pageNumber)}`);
    // await page.goto(`https://clutch.co/`)
    // console.log(await page.content());

    const searchResults = await page.$$eval(".directory-list > li", (itemInfo => {
        return itemInfo.map(itemInfoElement => {
            const companyLogoUrl = itemInfoElement?.querySelector(".company_logotype > img")?.getAttribute("data-src") || itemInfoElement?.querySelector(".company_logotype > img")?.getAttribute("src")
            return {
                companyName: itemInfoElement?.querySelector(".company_info .company_title.directory_profile")?.innerHTML.trim(),
                companyLogoUrl,
                profileId: itemInfoElement?.querySelector(".website-profile a")?.getAttribute("href")?.replace("/profile/", "")
            }
        })
    }))

    await browser.close();
    return JSON.stringify(searchResults);
}

export async function GET(request: Request) {
    const queryParam = new URLSearchParams(new URL(request.url).search);
    const path = queryParam.get("path") ?? "directory/mobile-application-developers";
    const pageNumber = queryParam.get("page") ?? "1";
    const pageItemList = await getListDataByPath(path, pageNumber)
    return new Response(pageItemList, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
}