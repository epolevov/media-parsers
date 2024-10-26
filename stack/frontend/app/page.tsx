import TableJournal from './ui/TableJournal';

export default function Home() {
  return (
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
      <main className='flex flex-col gap-8 row-start-2 items-center sm:items-start'>
        <ol className='list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]'>
          <li className='mb-2'>
            Введите URL источника, откуда вы хотите скачать картинки:{' '}
            <code className='bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold'>
              http://collections.hermitage.ru/entity/OBJECT/733251?sort=120&fundcoll=1423080035&index=0
              (пример)
            </code>
            .
          </li>
          <li>Нажмите &quot;Добавить&quot; и следите за изменением статуса.</li>
        </ol>

        <div className='flex items-center gap-x-2 w-full'>
          <input
            type='text'
            name='price'
            id='price'
            className='block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            placeholder='http://collections.hermitage.ru/entity/OBJECT/733251?sort=120&fundcoll=1423080035&index=0'
          />
          <button
            type='submit'
            className='rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          >
            Добавить
          </button>
        </div>

        <TableJournal />
      </main>
      <footer className='row-start-3 flex gap-6 flex-wrap items-center justify-center'></footer>
    </div>
  );
}
