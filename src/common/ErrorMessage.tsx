export const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error: {message}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
