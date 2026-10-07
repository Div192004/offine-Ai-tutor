export function createBenchmarkController(repository) {
  return {
    async getBenchmark(_request, response) {
      const benchmark = await repository.getBenchmark();
      response.json({
        benchmark,
        comparison: {
          offlineModel: benchmark.accuracy,
          cloudReference: "Not measured yet",
        },
      });
    },
  };
}

export async function getBenchmark(_request, response) {
  response.json({
    benchmark: {
      accuracy: "Not measured yet",
      averageResponseTime: "Not measured yet",
      modelSize: "Not measured yet",
      memoryUsage: "Not measured yet",
      testQuestions: "Not measured yet",
      offlineCapability: "Not measured yet",
    },
    comparison: {
      offlineModel: "Not measured yet",
      cloudReference: "Not measured yet",
    },
  });
}
