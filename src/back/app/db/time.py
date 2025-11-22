import datetime

FORMAT = 'GMT +3'


def getCurrentTime() -> int:
    now = int(datetime.datetime.now(datetime.timezone.utc).timestamp())
    return now + 3600 * 3