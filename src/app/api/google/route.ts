import { CastType } from '@/app/type';
import puppeteer from 'puppeteer';

async function getMovieCast(movieName: string) {
    const encodedSearch = encodeURIComponent(`${movieName} cast`);
    const browser = await puppeteer.launch({
        headless: 'new'
    });
    const page = await browser.newPage();
    await page.goto(`https://www.google.com/search?q=${encodedSearch}&hl=en&clie=1`);
    const searchResults: CastType[] = await page.$$eval(".uciohe > div:has(wp-grid-tile)", (castInfo => {
        return castInfo.map(castElement => {
            const googleUrl = castElement.querySelector("a")?.href;
            const cast = castElement.querySelector("wp-grid-tile");
            const imgElement = cast && cast.querySelector("img");
            const castElementInfo = cast && cast.querySelector("div:nth-child(2)")
            return {
                id: imgElement?.getAttribute("id"),
                img: imgElement?.getAttribute("src"),
                name: castElementInfo?.querySelector("div")?.innerHTML,
                roleName: castElementInfo?.querySelector("div:nth-child(2)")?.innerHTML,
                googleUrl: googleUrl
            }
        })
    }))

    await browser.close();
    return JSON.stringify(searchResults);
}

export async function GET(request: Request) {
    const queryParam = new URLSearchParams(new URL(request.url).search);
    const movieName = queryParam.get("movieName") ?? "";
    const movieCastInfo = await getMovieCast(movieName)
    return new Response(movieCastInfo, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
}