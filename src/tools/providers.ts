import { JSDOM } from 'jsdom'
import { z } from "zod"
import { Context } from "fastmcp"

const fetchProvider = async (path: string) => {
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

const fetchProviders = async () => {
    const response = await fetch("https://sdk.vercel.ai/providers")
    const html = await response.text()
    const dom = new JSDOM(html)
    const document = dom.window.document
    const providerLinks = Array.from(document.querySelectorAll('a[href^="/providers/"]'))
        .map((link) => {
            return { url: link.getAttribute('href'), title: link.textContent?.trim() }
        })
    const content = 'AI SDK Providers content:\n' + providerLinks.map((link) => {
        return `- [${link.title}](${link.url})`
    }).join('\n')
    return content
}

export const providersTool = {
    name: "providers",
    description: "Get AI SDK Providers information and documentation. If you want to get all providers, please provide no path. If you want to get a specific provider, please provide the path.",
    parameters: z.object({
        path: z.string().optional().describe("Path to the specific provider. If specified, it should start with /providers/. If not specified, all providers will be fetched."),
    }),
    execute: async (args: { path?: string; }, context: Context<any>) => {
        const { log } = context
        const { path } = args
        if (path && path.startsWith("/providers/")) {
            log.info("Fetching provider for path:", path)
            const content = await fetchProvider(path)
            return {
                content: [
                    {
                        type: "text" as const,
                        text: content,
                    },
                ],
            }
        }

        log.info("Fetching all providers")
        const content = await fetchProviders()
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
