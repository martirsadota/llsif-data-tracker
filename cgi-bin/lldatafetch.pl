use strict;
use warnings;

use CGI qw( :standard );
use JSON;
use HTTP::Tiny;

my $event_index = param('eid');
my $user_id = param('uid');

my $alpaca = HTTP::Tiny->new()->get("https://ll.idolactiviti.es/en/tracker/history_user/$event_index/$user_id");
my @ranks;
my @scores;
my $last_nick;

if ($alpaca->{success}) {
	my $mess = decode_json($alpaca->{content});
	foreach my $i (@{$mess}) {
		push  @ranks, $i->{rank};
		push  @scores, $i->{score};
		$last_nick = $i->{name};
	}
	if (param('init')) {
		print header ('application/json; charset=utf-8');
		print encode_json({
			event_name => 'Current Event',
			last_nick => $last_nick,
			ranks => [@ranks],
			scores => [@scores]
		});
	} elsif (scalar (@ranks) == param('clen')) {
		print header ({-status => '304 Not Modified'});
	} else {
		print header ('application/json; charset=utf-8');
		print encode_json({
			last_nick => $last_nick,
			last_rank => $ranks[-1],
			last_score => $scores[-1]
		});
	}
} else {
	print header ({-status => '500 Internal Server Error'});
}