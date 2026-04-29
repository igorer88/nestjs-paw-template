export const mockDataSource = {
  query: jest.fn()
}

export const resetMockDataSource = () => {
  mockDataSource.query.mockReset()
}

export const mockQueryResolvedValue = (value: unknown) => {
  mockDataSource.query.mockResolvedValue(value)
}

export const mockQueryRejectedValue = (error: Error) => {
  mockDataSource.query.mockRejectedValue(error)
}
