import { JSDOM } from 'jsdom'
import { z } from "zod"
import { Context } from "fastmcp"

const fetchCookbook = async (path: string) => {
    const response = await fetch(`https://sdk.vercel.ai${path}`)
    const html = await response.text()

    const dom = new JSDOM(html)
    const document = dom.window.document

    const mainContent = document.querySelector('main') || document.querySelector('article')

    if (!mainContent) {
        const bodyText = document.body.textContent || ''
        return bodyText.length > 50000 ? bodyText.substring(0, 50000) + '...(content truncated due to length)' : bodyText
    }

    const elementsToRemove = mainContent.querySelectorAll('nav, footer, aside, script, style')
    elementsToRemove.forEach(el => el.remove())

    const contentText = mainContent.textContent || ''

    return contentText.length > 50000 ? contentText.substring(0, 50000) + '...(content truncated due to length)' : contentText
}

const fetchCookbooks = async () => {
    const response = await fetch("https://sdk.vercel.ai/cookbook/next")
    const html = await response.text()
    const dom = new JSDOM(html)
    const document = dom.window.document
    const cookbookLinks = Array.from(document.querySelectorAll('a[href^="/cookbook/"]'))
        .map((link) => {
            return { url: link.getAttribute('href'), title: link.textContent?.trim() }
        })
    const content = 'AI SDK Cookbook content:\n' + cookbookLinks.map((link) => {
        return `- [${link.title}](${link.url})`
    }).join('\n')
    return content
}

export const cookbookTool = {
    name: "cookbook",
    description: "Get AI SDK Cookbook content with examples and tutorials. If you want to get all cookbooks, please provide no path. If you want to get a specific cookbook, please provide the path.",
    parameters: z.object({
        path: z.string().optional().describe("Path to the specific cookbook. If specified, it should start with /cookbook/. If not specified, all cookbooks will be fetched."),
    }),
    execute: async (args: { path?: string; }, context: Context<any>) => {
        const { log } = context
        const { path } = args
        if (path && path.startsWith("/cookbook/")) {
            log.info("Fetching cookbook for path:", path)
            const content = await fetchCookbook(path)
            return {
                content: [
                    {
                        type: "text" as const,
                        text: content,
                    },
                ],
            }
        }

        log.info("Fetching all cookbooks")
        const content = await fetchCookbooks()
        return {
            content: [
                {
                    type: "text" as const,
                    text: content,
                },
            ],
        }
    },
}
