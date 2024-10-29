"use client";

export default function Home() {

    const onSubmitHandler = async (event)=> {
      event.preventDefault()
      const subject = event.target.subject.value
      console.log(subject)
    }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={onSubmitHandler} className="space-y-6">
          <div>
            <label htmlFor="subject" className="block text-sm/6 font-medium text-gray-900">
              Main subject of the story:
            </label>
            <div className="mt-2">
              <input
                id="subject"
                name="subject"
                type="subject"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Generate text
            </button>
          </div>
        </form>
      </div>

      <div className="bg-indigo-100 mt-12 max-w-2xl mx-auto">
        <div className="mx-auto p-6 lg:flex lg:items-center lg:justify-between">
        Lorem ipsum odor amet, consectetuer adipiscing elit. Sapien tincidunt elit nulla consequat conubia. Integer blandit facilisis condimentum neque erat integer. Adipiscing conubia dui dolor ex primis. Habitasse odio risus in neque odio id iaculis nunc. Cursus proin ultricies litora vel dignissim. Molestie maecenas gravida id tellus cras lobortis auctor. Ut nostra eros natoque varius ac imperdiet. Per pulvinar maecenas leo imperdiet dis.
        </div>
      </div>
    </div>
  )
}
