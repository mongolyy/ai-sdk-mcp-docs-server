import { JSDOM } from 'jsdom'
import { z } from "zod"
import { Context } from "fastmcp"

const fetchCookbook = async (path: string) => {
    const response = await fetch(`https://sdk.vercel.ai${path}`)
    const cookbook = await response.text()
    return cookbook
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
    description: "Get AI SDK Cookbook content with examples and tutorials. If you want to get a specific cookbook, please provide the path. For example: /cookbook/next/generate-text. If you want to get all cookbooks, please provide no path.",
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
