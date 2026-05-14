import { NextResponse } from "next/server";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function created<T>(data: T) {
  return NextResponse.json(data, { status: 201 });
}

export function badRequest(message: string, details?: unknown) {
  return NextResponse.json(
    { error: { code: "BAD_REQUEST", message, details: details ?? null } },
    { status: 400 }
  );
}

export function notFound(resource: string) {
  return NextResponse.json(
    { error: { code: "NOT_FOUND", message: `${resource} not found.` } },
    { status: 404 }
  );
}

export function serverError(message: string) {
  return NextResponse.json(
    { error: { code: "SERVER_ERROR", message } },
    { status: 500 }
  );
}
