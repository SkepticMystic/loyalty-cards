export const Arrays = {
  sum: (arr: number[]) => arr.reduce((a, b) => a + b, 0),

  group_by: <T extends P, G extends string, P = T>(
    list: T[],
    get_value: (item: T) => G | undefined,
    projector: (item: T) => P = (x) => x as P,
  ) => {
    const grouped: Partial<Record<G, P[]>> = {};

    list.forEach((item) => {
      const key = get_value(item);
      // WARN: Doesn't group undefined values
      if (key === undefined) return;

      const projected = projector(item);
      const group = grouped[key];
      if (group) group.push(projected);
      else grouped[key] = [projected];
    });

    return grouped;
  },
};
