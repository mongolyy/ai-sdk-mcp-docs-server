import { JSDOM } from 'jsdom'
import { z } from "zod"
import { Context } from "fastmcp"

const fetchDoc = async (path: string) => {
    const response = await fetch(`https://sdk.vercel.ai${path}`)
    const html = await response.text()

    const dom = new JSDOM(html)
    const document = dom.window.document

    const mainContent = document.querySelector('main') || document.querySelector('article')

    if (!mainContent) {
        const bodyText = document.body.textContent || ''
        return bodyText.length > 10000 ? bodyText.substring(0, 10000) + '...(content truncated due to length)' : bodyText
    }

    const elementsToRemove = mainContent.querySelectorAll('nav, footer, aside, script, style')
    elementsToRemove.forEach(el => el.remove())

    const contentText = mainContent.textContent || ''

    return contentText.length > 10000 ? contentText.substring(0, 10000) + '...(content truncated due to length)' : contentText
}

const fetchDocs = async () => {
    const response = await fetch("https://sdk.vercel.ai/docs")
    const html = await response.text()
    const dom = new JSDOM(html)
    const document = dom.window.document
    const docLinks = Array.from(document.querySelectorAll('a[href^="/docs/"]'))
        .map((link) => {
            return { url: link.getAttribute('href'), title: link.textContent?.trim() }
        })
    const content = 'AI SDK Docs content:\n' + docLinks.map((link) => {
        return `- [${link.title}](${link.url})`
    }).join('\n')
    return content
}

export const docsTool = {
    name: "docs",
    description: "Get AI SDK Docs content. If you want to get a specific doc, please provide the path. For example: /docs/introduction. If you want to get all docs, please provide no path.",
    parameters: z.object({
        path: z.string().optional().describe("Path to the specific doc. If specified, it should start with /docs/. If not specified, all docs will be fetched."),
    }),
    execute: async (args: { path?: string; }, context: Context<any>) => {
        const { log } = context
        const { path } = args
        if (path && path.startsWith("/docs/")) {
            log.info("Fetching docs for path:", path)
            const content = await fetchDoc(path)
            return {
                content: [
                    {
                        type: "text" as const,
                        text: content,
                    },
                ],
            }
        }

        log.info("Fetching all docs")
        const content = await fetchDocs()
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
