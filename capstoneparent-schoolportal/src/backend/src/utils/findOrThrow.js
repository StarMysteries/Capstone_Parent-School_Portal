/**
 * findOrThrow.js
 *
 * A thin wrapper around any Prisma findUnique / findFirst call.
 * Throws a descriptive error instead of returning null, eliminating
 * the repeated "find → check null → throw" pattern across every service.
 *
 * Usage:
 *   const student = await findOrThrow(
 *     () => prisma.student.findUnique({ where: { student_id: id } }),
 *     'Student not found'
 *   );
 */

/**
 * @template T
 * @param {() => Promise<T | null>} queryFn  — zero-arg function that returns a Prisma promise
 * @param {string} errorMessage              — message thrown when the record is null
 * @returns {Promise<T>}
 */
const findOrThrow = async (queryFn, errorMessage) => {
  const record = await queryFn();
  if (!record) {
    throw new Error(errorMessage);
  }
  return record;
};

module.exports = { findOrThrow };
