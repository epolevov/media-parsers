const TableJournal = () => {
  return (
    <table className='border-collapse border border-slate-500 w-full'>
      <thead>
        <tr>
          <th className='border border-slate-600'>ID</th>
          <th className='border border-slate-600'>Url</th>
          <th className='border border-slate-600'>Статус</th>
          <th className='border border-slate-600'>Прогресс</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className='border border-slate-700'>1</td>
          <td className='border border-slate-700'>https://test.ru</td>
          <td className='border border-slate-700'>В очереди...</td>
          <td className='border border-slate-700'>Загружено 7 из 1000</td>
        </tr>
      </tbody>
    </table>
  );
};

export default TableJournal;
