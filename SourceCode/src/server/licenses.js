import { readFile, writeFile } from 'fs/promises'
import { builtinRootDirectory } from './helpers/paths.js'

export const registerLicensesRoutes = (router) => {
	router.get('/licenses', async (context) => {
		context.type = 'text/plain'

		context.body = [
			'此程序的源代码可以在 https://github.com/drweissbrot/cs-hud 上查看.\n',
			'包括 我(nsnsay) 也正在使用此源码进行二次开发。我希望您尊重程序开发者的心血。',
			'以下是源程序的声明:',
			await readFile(`${builtinRootDirectory}/license.txt`, 'utf-8'),
			'-----\n',
			await readFile(`${builtinRootDirectory}/assets/licenses.txt`, 'utf-8'),
		].join('\n')
	})
}
