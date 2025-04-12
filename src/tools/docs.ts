import { JSDOM } from 'jsdom'
import { z } from "zod"
import { Context } from "fastmcp"

const fetchDoc = async (path: string) => {
    const response = await fetch(`https://sdk.vercel.ai${path}`)
    const doc = await response.text()
    return doc
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
    description: "Get AI SDK Docs content",
    parameters: z.object({
        path: z.string().optional(),
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
