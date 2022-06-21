import Head from 'next/head';

export default function Home() {
  return (
    <div className='py-0 px-8'>
      <Head>
        <title>STE Reuasable React Components</title>
        <meta name='description' content='STE Reuasable React Components' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='min-h-screen py-16 px-0 flex-1 flex flex-col justify-around items-center'>
        <h1 className='m-0 text-[6rem] text-center flex flex-col justify-center items-center cursor-default'>
          <span className='text-[#5570f3] leading-[3.5rem] font-semibold px-9'>
            STEReact
          </span>
          <span className='text-[#5570f3] text-4xl leading-5 border-b-2 w-full shadow-xl hover:shadow-sm transition-all duration-500 py-5'>
            Components
          </span>
          <p className='text-center my-8 mx-0 leading-6 text-[1.15rem]'>
            Take a look inside
          </p>
        </h1>

        <div className='flex justify-center items-center flex-wrap min-w-[800px] '>
          <a
            href='#'
            className='m-4 p-6 text-left text-inherit no-underline border-[1px] border-[#5570f329] rounded-[10px] ease-in-out max-w-[300px] hover:text-[#5570f3] hover:border-[#5570f333] shadow-2xl hover:shadow-md transition-all duration-500 relative'
          >
            <h2 className='m-0 mb-4 text-2xl'>DataGrid</h2>
            <p className=' m-0 text-xl'>
              A complete data grid component with features like, "Addressable
              Data Visualization", "Pagination", "Columns Sorting" and "Columns
              Filtering".
            </p>
            <span className='w-full text-right text-xs absolute z-10 right-2'>Demo &rarr;</span>
          </a>

          <a
            href='#'
            className='m-4 p-6 text-left text-inherit no-underline border-[1px] border-[#5570f329] rounded-[10px] ease-in-out max-w-[300px] hover:text-[#5570f3] hover:border-[#5570f333] shadow-2xl hover:shadow-md transition-all duration-500 relative'
          >
            <h2 className='m-0 mb-4 text-2xl'>Forms</h2>
            <p className=' m-0 text-xl'>
              A modular form component for handling CRUD operations in
              front-end, using the same column definitions that DataGrid uses.
            </p>
            <span className='w-full text-right text-xs absolute z-10 right-2'>Demo &rarr;</span>
          </a>
        </div>
      </main>
    </div>
  );
}
